# 3D Models Directory

This directory contains GLB (GLTF binary) models for furniture and event items.

## Installed Models:

### Furniture (`/furniture/`) ✅
- `modern-chair.glb` ✅
- `dining-table-large.glb` ✅
- `modern-sofa.glb` ✅
- `coffee-table.glb` ✅
- `armchair.glb` ✅
- `bookshelf.glb` ✅

### Event Items (`/event/`) ✅
- `bar-counter.glb` ✅
- `bar-stool.glb` ✅
- `stage-platform.glb` ✅

### Decorative Items (`/decor/`) ✅
- `potted-plant.glb` ✅

## Missing Models (will use fallback geometry):

### Additional Furniture
- `side-table.glb`
- `modern-bed.glb`
- `storage-cabinet.glb`

### Additional Event Items
- `grand-piano.glb`

### Additional Decorative Items
- `crystal-chandelier.glb` (in `/lighting/` subdirectory)
- `wall-mirror.glb`

## Model Requirements:
- **Format**: GLB (GLTF 2.0 Binary)
- **Poly Count**: < 10,000 triangles per model (recommended for web performance)
- **File Size**: < 5MB per model (GitHub has 100MB limit, but smaller is better for loading)
- **Textures**: PBR materials preferred
- **Scale**: Real-world units (meters)
- **Optimization**: Web-optimized for real-time rendering

## Deployment Notes:
⚠️ **Large GLB files are excluded from Git** due to GitHub's file size limits.
For deployment, you need to:
1. Download suitable GLB models from recommended sources
2. Place them in the correct directories with exact filenames listed above
3. Ensure file sizes are optimized for web (< 5MB each recommended)

## Fallback System:
When GLB models are not available, the system automatically uses procedural geometry fallbacks to ensure the 3D scene always renders properly.

## Recommended Sources for Web-Optimized Models:
- **Sketchfab** (https://sketchfab.com/) - Filter by "Downloadable" and "Low-poly"
- **Google Poly Archive** (https://poly.pizza/) - Archived but still accessible
- **Kenney Assets** (https://kenney.nl/assets) - Free, optimized game assets
- **Quaternius** (https://quaternius.com/) - Free low-poly models
- **CGTrader** - Search for "low poly" and "GLB" format

## Model Optimization Tips:
- Use tools like **Blender** or **glTF-Transform** to reduce file sizes
- Remove unnecessary animations and morphs
- Compress textures to 512x512 or 1024x1024 max
- Use Draco compression for geometry when possible