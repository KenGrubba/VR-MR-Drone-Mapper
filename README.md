# VR-MR-Drone-Mapper

Monorepo:
- /client-ui           → Map UI (draw area, 20x20, submit)
- /drone-service       → Battery check, mission planning, simulator/SDK
- /processing          → Photogrammetry (ODM/COLMAP)
- /unity-importer      → Unity scene import/grayscale/physics

## Dev
- Create a feature branch:  git checkout -b feature/B2-draw-area
- Run CI locally:          npm test --prefix client-ui   (if set up)
