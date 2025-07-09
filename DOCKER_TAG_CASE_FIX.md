# 🔧 Docker Tag Case Sensitivity Fix

## ❌ **Error yang Dialami:**
```
The failure is caused by the Docker image tag: 
ghcr.io/300902/API-Web-Automation-Testing/automation-tests:latest

Docker requires repository names (including the image name and path) to be all lowercase.
```

## 🔍 **Penyebab Error:**
- Docker registry memerlukan repository names dalam **lowercase** saja
- GitHub repository name menggunakan huruf besar: `API-Web-Automation-Testing`
- Docker tag yang dihasilkan: `ghcr.io/300902/API-Web-Automation-Testing/automation-tests`
- Docker menolak karena mengandung huruf besar

## ✅ **Solusi yang Diterapkan:**

### 1. **Menambahkan Step untuk Convert ke Lowercase**
```yaml
- name: Set lowercase repository name
  id: repo
  run: echo "repository=$(echo ${{ github.repository }} | tr '[:upper:]' '[:lower:]')" >> $GITHUB_OUTPUT
```

### 2. **Menggunakan Lowercase Repository Name**
```yaml
- name: Build and push Docker image to GHCR
  uses: docker/build-push-action@v5
  with:
    context: .
    push: true
    tags: |
      ghcr.io/${{ steps.repo.outputs.repository }}/automation-tests:latest
      ghcr.io/${{ steps.repo.outputs.repository }}/automation-tests:${{ github.sha }}
```

## 🎯 **Hasil Setelah Fix:**

### ✅ **Docker Tags yang Dihasilkan:**
- **Before:** `ghcr.io/300902/API-Web-Automation-Testing/automation-tests:latest`
- **After:** `ghcr.io/300902/api-web-automation-testing/automation-tests:latest`

### ✅ **Transformasi:**
- Repository: `300902/API-Web-Automation-Testing` → `300902/api-web-automation-testing`
- Image name: `automation-tests` (sudah lowercase)
- Tag: `latest` dan `<commit-sha>`

## 🔧 **Cara Kerja tr Command:**
```bash
echo "API-Web-Automation-Testing" | tr '[:upper:]' '[:lower:]'
# Output: api-web-automation-testing
```

## 📦 **Docker Images Location (Fixed):**
```
ghcr.io/300902/api-web-automation-testing/automation-tests:latest
ghcr.io/300902/api-web-automation-testing/automation-tests:<commit-sha>
```

## 🔗 **Cara Menggunakan Image (Updated):**
```bash
# Pull image
docker pull ghcr.io/300902/api-web-automation-testing/automation-tests:latest

# Run container
docker run -p 3000:3000 ghcr.io/300902/api-web-automation-testing/automation-tests:latest

# Run with environment variables
docker run --rm -e API_BASE_URL=https://api.example.com \
  ghcr.io/300902/api-web-automation-testing/automation-tests:latest
```

## 🎉 **Status Setelah Fix:**

✅ **Docker Build Job:** Sekarang berjalan tanpa case sensitivity error  
✅ **Image Push:** Berhasil push ke GHCR dengan lowercase repository name  
✅ **Docker Tags:** Semuanya dalam format lowercase yang valid  
✅ **Compliance:** Sesuai dengan Docker registry requirements  

## 📋 **Best Practices untuk Docker Tags:**

1. **Selalu gunakan lowercase** untuk repository names
2. **Avoid special characters** selain dash (-) dan underscore (_)  
3. **Use consistent naming** untuk image tags
4. **Consider using semantic versioning** untuk production images

## 🔍 **Troubleshooting:**

Jika masih ada error, periksa:
1. **Repository name format:** Pastikan tidak ada karakter special
2. **Registry permissions:** Pastikan GITHUB_TOKEN memiliki akses write
3. **Image size:** Pastikan image tidak terlalu besar
4. **Build context:** Pastikan Dockerfile ada dan valid

**Status:** 🎉 **DOCKER TAG CASE SENSITIVITY FIXED!**
