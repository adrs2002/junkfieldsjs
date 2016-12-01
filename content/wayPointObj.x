xof 0303txt 0032

template XSkinMeshHeader {
 <3cf169ce-ff7c-44ab-93c0-f78f62d172e2>
 WORD nMaxSkinWeightsPerVertex;
 WORD nMaxSkinWeightsPerFace;
 WORD nBones;
}

template VertexDuplicationIndices {
 <b8d65549-d7c9-4995-89cf-53a9a8b031e3>
 DWORD nIndices;
 DWORD nOriginalVertices;
 array DWORD indices[nIndices];
}

template SkinWeights {
 <6f0d123b-bad2-4167-a0d0-80224f25fabb>
 STRING transformNodeName;
 DWORD nWeights;
 array DWORD vertexIndices[nWeights];
 array FLOAT weights[nWeights];
 Matrix4x4 matrixOffset;
}


Frame Frame_SCENE_ROOT {

 FrameTransformMatrix {
  1.000000,0.000000,0.000000,0.000000,0.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000;;
 }

 Frame Frame1_wayPointObj {

  FrameTransformMatrix {
   1.000000,0.000000,0.000000,0.000000,0.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000,0.000000,0.000000,0.000000,0.000000,1.000000;;
  }

  Mesh Mesh_wayPointObj {
   128;
   -0.250000;1.000000;-0.250000;,
   -0.250000;1.000000;-0.250000;,
   -0.250000;1.000000;-0.250000;,
   -0.250000;1.000000;-0.250000;,
   0.250000;1.000000;-0.250000;,
   0.250000;1.000000;-0.250000;,
   0.250000;1.000000;-0.250000;,
   0.250000;1.000000;-0.250000;,
   0.250000;1.000000;0.250000;,
   0.250000;1.000000;0.250000;,
   0.250000;1.000000;0.250000;,
   0.250000;1.000000;0.250000;,
   -0.250000;1.000000;0.250000;,
   -0.250000;1.000000;0.250000;,
   -0.250000;1.000000;0.250000;,
   -0.250000;1.000000;0.250000;,
   0.000000;0.000000;0.000000;,
   0.000000;0.000000;0.000000;,
   0.000000;0.000000;0.000000;,
   0.000000;0.000000;0.000000;,
   -0.170000;1.100000;-0.170000;,
   -0.170000;1.100000;-0.170000;,
   -0.170000;1.100000;-0.170000;,
   -0.170000;1.100000;0.170000;,
   -0.170000;1.100000;0.170000;,
   -0.170000;1.100000;0.170000;,
   0.170000;1.100000;0.170000;,
   0.170000;1.100000;0.170000;,
   0.170000;1.100000;0.170000;,
   0.170000;1.100000;-0.170000;,
   0.170000;1.100000;-0.170000;,
   0.170000;1.100000;-0.170000;,
   10.000000;-0.200000;0.000000;,
   10.000000;-0.200000;0.000000;,
   9.659258;-0.200000;2.588191;,
   9.659258;-0.200000;2.588191;,
   8.660254;-0.200000;5.000000;,
   8.660254;-0.200000;5.000000;,
   7.071068;-0.200000;7.071068;,
   7.071068;-0.200000;7.071068;,
   5.000000;-0.200000;8.660254;,
   5.000000;-0.200000;8.660254;,
   2.588191;-0.200000;9.659258;,
   2.588191;-0.200000;9.659258;,
   0.000000;-0.200000;10.000000;,
   0.000000;-0.200000;10.000000;,
   -2.588191;-0.200000;9.659258;,
   -2.588191;-0.200000;9.659258;,
   -5.000000;-0.200000;8.660254;,
   -5.000000;-0.200000;8.660254;,
   -7.071068;-0.200000;7.071068;,
   -7.071068;-0.200000;7.071068;,
   -8.660254;-0.200000;5.000000;,
   -8.660254;-0.200000;5.000000;,
   -9.659258;-0.200000;2.588191;,
   -9.659258;-0.200000;2.588191;,
   -10.000000;-0.200000;0.000000;,
   -10.000000;-0.200000;0.000000;,
   -9.659258;-0.200000;-2.588191;,
   -9.659258;-0.200000;-2.588191;,
   -8.660254;-0.200000;-5.000000;,
   -8.660254;-0.200000;-5.000000;,
   -7.071068;-0.200000;-7.071068;,
   -7.071068;-0.200000;-7.071068;,
   -5.000000;-0.200000;-8.660254;,
   -5.000000;-0.200000;-8.660254;,
   -2.588191;-0.200000;-9.659258;,
   -2.588191;-0.200000;-9.659258;,
   0.000000;-0.200000;-10.000000;,
   0.000000;-0.200000;-10.000000;,
   2.588191;-0.200000;-9.659258;,
   2.588191;-0.200000;-9.659258;,
   5.000000;-0.200000;-8.660254;,
   5.000000;-0.200000;-8.660254;,
   7.071068;-0.200000;-7.071068;,
   7.071068;-0.200000;-7.071068;,
   8.660254;-0.200000;-5.000000;,
   8.660254;-0.200000;-5.000000;,
   9.659258;-0.200000;-2.588191;,
   9.659258;-0.200000;-2.588191;,
   10.000000;0.400000;0.000000;,
   10.000000;0.400000;0.000000;,
   9.659258;0.400000;2.588191;,
   9.659258;0.400000;2.588191;,
   8.660254;0.400000;5.000000;,
   8.660254;0.400000;5.000000;,
   7.071068;0.400000;7.071068;,
   7.071068;0.400000;7.071068;,
   5.000000;0.400000;8.660254;,
   5.000000;0.400000;8.660254;,
   2.588191;0.400000;9.659258;,
   2.588191;0.400000;9.659258;,
   0.000000;0.400000;10.000000;,
   0.000000;0.400000;10.000000;,
   -2.588191;0.400000;9.659258;,
   -2.588191;0.400000;9.659258;,
   -5.000000;0.400000;8.660254;,
   -5.000000;0.400000;8.660254;,
   -7.071068;0.400000;7.071068;,
   -7.071068;0.400000;7.071068;,
   -8.660254;0.400000;5.000000;,
   -8.660254;0.400000;5.000000;,
   -9.659258;0.400000;2.588191;,
   -9.659258;0.400000;2.588191;,
   -10.000000;0.400000;0.000000;,
   -10.000000;0.400000;0.000000;,
   -9.659258;0.400000;-2.588191;,
   -9.659258;0.400000;-2.588191;,
   -8.660254;0.400000;-5.000000;,
   -8.660254;0.400000;-5.000000;,
   -7.071068;0.400000;-7.071068;,
   -7.071068;0.400000;-7.071068;,
   -5.000000;0.400000;-8.660254;,
   -5.000000;0.400000;-8.660254;,
   -2.588191;0.400000;-9.659258;,
   -2.588191;0.400000;-9.659258;,
   0.000000;0.400000;-10.000000;,
   0.000000;0.400000;-10.000000;,
   2.588191;0.400000;-9.659258;,
   2.588191;0.400000;-9.659258;,
   5.000000;0.400000;-8.660254;,
   5.000000;0.400000;-8.660254;,
   7.071068;0.400000;-7.071068;,
   7.071068;0.400000;-7.071068;,
   8.660254;0.400000;-5.000000;,
   8.660254;0.400000;-5.000000;,
   9.659258;0.400000;-2.588191;,
   9.659258;0.400000;-2.588191;;
   62;
   3;76,126,78;,
   3;4,8,16;,
   3;17,9,12;,
   3;18,13,0;,
   3;20,26,29;,
   3;5,21,30;,
   3;1,23,22;,
   3;14,27,24;,
   3;6,28,10;,
   3;32,82,34;,
   3;35,84,36;,
   3;37,86,38;,
   3;39,88,40;,
   3;41,90,42;,
   3;43,92,44;,
   3;46,93,94;,
   3;48,95,96;,
   3;50,97,98;,
   3;52,99,100;,
   3;54,101,102;,
   3;56,103,104;,
   3;58,105,106;,
   3;60,107,108;,
   3;62,109,110;,
   3;64,111,112;,
   3;66,113,114;,
   3;68,115,116;,
   3;69,118,70;,
   3;71,120,72;,
   3;73,122,74;,
   3;75,124,77;,
   3;2,7,19;,
   3;79,80,33;,
   3;20,25,26;,
   3;5,3,21;,
   3;1,15,23;,
   3;14,11,27;,
   3;6,31,28;,
   3;32,81,82;,
   3;35,83,84;,
   3;37,85,86;,
   3;39,87,88;,
   3;41,89,90;,
   3;43,91,92;,
   3;46,45,93;,
   3;48,47,95;,
   3;50,49,97;,
   3;52,51,99;,
   3;54,53,101;,
   3;56,55,103;,
   3;58,57,105;,
   3;60,59,107;,
   3;62,61,109;,
   3;64,63,111;,
   3;66,65,113;,
   3;68,67,115;,
   3;69,117,118;,
   3;71,119,120;,
   3;73,121,122;,
   3;75,123,124;,
   3;76,125,126;,
   3;79,127,80;;

   MeshNormals {
    128;
    -0.970142;-0.242536;0.000000;,
    -0.780869;0.624695;0.000000;,
    0.000000;-0.242536;-0.970142;,
    0.000000;0.624695;-0.780869;,
    0.970142;-0.242536;0.000000;,
    0.000000;0.624695;-0.780869;,
    0.780869;0.624695;0.000000;,
    0.000000;-0.242536;-0.970142;,
    0.970142;-0.242536;0.000000;,
    0.000000;-0.242536;0.970142;,
    0.780869;0.624695;0.000000;,
    0.000000;0.624695;0.780869;,
    0.000000;-0.242536;0.970142;,
    -0.970142;-0.242536;0.000000;,
    0.000000;0.624695;0.780869;,
    -0.780869;0.624695;0.000000;,
    0.970142;-0.242536;0.000000;,
    0.000000;-0.242536;0.970142;,
    -0.970142;-0.242536;0.000000;,
    0.000000;-0.242536;-0.970142;,
    0.000000;1.000000;0.000000;,
    0.000000;0.624695;-0.780869;,
    -0.780869;0.624695;0.000000;,
    -0.780869;0.624695;0.000000;,
    0.000000;0.624695;0.780869;,
    0.000000;1.000000;0.000000;,
    0.000000;1.000000;0.000000;,
    0.000000;0.624695;0.780869;,
    0.780869;0.624695;0.000000;,
    0.000000;1.000000;0.000000;,
    0.000000;0.624695;-0.780869;,
    0.780869;0.624695;0.000000;,
    0.991445;0.000000;0.130526;,
    0.991445;0.000000;-0.130526;,
    0.991445;0.000000;0.130526;,
    0.923880;0.000000;0.382683;,
    0.923880;0.000000;0.382683;,
    0.793353;0.000000;0.608761;,
    0.793353;0.000000;0.608761;,
    0.608761;0.000000;0.793353;,
    0.608761;0.000000;0.793353;,
    0.382683;0.000000;0.923880;,
    0.382683;0.000000;0.923880;,
    0.130526;0.000000;0.991445;,
    0.130526;0.000000;0.991445;,
    -0.130526;0.000000;0.991445;,
    -0.130526;0.000000;0.991445;,
    -0.382683;0.000000;0.923880;,
    -0.382683;0.000000;0.923880;,
    -0.608761;0.000000;0.793353;,
    -0.608761;0.000000;0.793353;,
    -0.793353;0.000000;0.608761;,
    -0.793353;0.000000;0.608761;,
    -0.923880;0.000000;0.382683;,
    -0.923880;0.000000;0.382683;,
    -0.991445;0.000000;0.130526;,
    -0.991445;0.000000;0.130526;,
    -0.991445;0.000000;-0.130526;,
    -0.991445;0.000000;-0.130526;,
    -0.923880;0.000000;-0.382683;,
    -0.923880;0.000000;-0.382683;,
    -0.793353;0.000000;-0.608761;,
    -0.793353;0.000000;-0.608761;,
    -0.608761;0.000000;-0.793353;,
    -0.608761;0.000000;-0.793353;,
    -0.382683;0.000000;-0.923880;,
    -0.382683;0.000000;-0.923880;,
    -0.130526;0.000000;-0.991445;,
    -0.130526;0.000000;-0.991445;,
    0.130526;0.000000;-0.991445;,
    0.130526;0.000000;-0.991445;,
    0.382683;0.000000;-0.923880;,
    0.382683;0.000000;-0.923880;,
    0.608761;0.000000;-0.793353;,
    0.608761;0.000000;-0.793353;,
    0.793353;0.000000;-0.608761;,
    0.923880;0.000000;-0.382683;,
    0.793353;0.000000;-0.608761;,
    0.923880;0.000000;-0.382683;,
    0.991445;0.000000;-0.130526;,
    0.991445;0.000000;-0.130526;,
    0.991445;0.000000;0.130526;,
    0.991445;0.000000;0.130526;,
    0.923880;0.000000;0.382683;,
    0.923880;0.000000;0.382683;,
    0.793353;0.000000;0.608761;,
    0.793353;0.000000;0.608761;,
    0.608761;0.000000;0.793353;,
    0.608761;0.000000;0.793353;,
    0.382683;0.000000;0.923880;,
    0.382683;0.000000;0.923880;,
    0.130526;0.000000;0.991445;,
    0.130526;0.000000;0.991445;,
    -0.130526;0.000000;0.991445;,
    -0.130526;0.000000;0.991445;,
    -0.382683;0.000000;0.923880;,
    -0.382683;0.000000;0.923880;,
    -0.608761;0.000000;0.793353;,
    -0.608761;0.000000;0.793353;,
    -0.793353;0.000000;0.608761;,
    -0.793353;0.000000;0.608761;,
    -0.923880;0.000000;0.382683;,
    -0.923880;0.000000;0.382683;,
    -0.991445;0.000000;0.130526;,
    -0.991445;0.000000;0.130526;,
    -0.991445;0.000000;-0.130526;,
    -0.991445;0.000000;-0.130526;,
    -0.923880;0.000000;-0.382683;,
    -0.923880;0.000000;-0.382683;,
    -0.793353;0.000000;-0.608761;,
    -0.793353;0.000000;-0.608761;,
    -0.608761;0.000000;-0.793353;,
    -0.608761;0.000000;-0.793353;,
    -0.382683;0.000000;-0.923880;,
    -0.382683;0.000000;-0.923880;,
    -0.130526;0.000000;-0.991445;,
    -0.130526;0.000000;-0.991445;,
    0.130526;0.000000;-0.991445;,
    0.130526;0.000000;-0.991445;,
    0.382683;0.000000;-0.923880;,
    0.382683;0.000000;-0.923880;,
    0.608761;0.000000;-0.793353;,
    0.608761;0.000000;-0.793353;,
    0.793353;0.000000;-0.608761;,
    0.793353;0.000000;-0.608761;,
    0.923880;0.000000;-0.382683;,
    0.923880;0.000000;-0.382683;,
    0.991445;0.000000;-0.130526;;
    62;
    3;76,126,78;,
    3;4,8,16;,
    3;17,9,12;,
    3;18,13,0;,
    3;20,26,29;,
    3;5,21,30;,
    3;1,23,22;,
    3;14,27,24;,
    3;6,28,10;,
    3;32,82,34;,
    3;35,84,36;,
    3;37,86,38;,
    3;39,88,40;,
    3;41,90,42;,
    3;43,92,44;,
    3;46,93,94;,
    3;48,95,96;,
    3;50,97,98;,
    3;52,99,100;,
    3;54,101,102;,
    3;56,103,104;,
    3;58,105,106;,
    3;60,107,108;,
    3;62,109,110;,
    3;64,111,112;,
    3;66,113,114;,
    3;68,115,116;,
    3;69,118,70;,
    3;71,120,72;,
    3;73,122,74;,
    3;75,124,77;,
    3;2,7,19;,
    3;79,80,33;,
    3;20,25,26;,
    3;5,3,21;,
    3;1,15,23;,
    3;14,11,27;,
    3;6,31,28;,
    3;32,81,82;,
    3;35,83,84;,
    3;37,85,86;,
    3;39,87,88;,
    3;41,89,90;,
    3;43,91,92;,
    3;46,45,93;,
    3;48,47,95;,
    3;50,49,97;,
    3;52,51,99;,
    3;54,53,101;,
    3;56,55,103;,
    3;58,57,105;,
    3;60,59,107;,
    3;62,61,109;,
    3;64,63,111;,
    3;66,65,113;,
    3;68,67,115;,
    3;69,117,118;,
    3;71,119,120;,
    3;73,121,122;,
    3;75,123,124;,
    3;76,125,126;,
    3;79,127,80;;
   }

   MeshTextureCoords {
    128;
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    1.000000;1.000000;,
    1.000000;1.000000;,
    1.000000;1.000000;,
    1.000000;1.000000;,
    1.000000;0.000000;,
    1.000000;0.000000;,
    1.000000;0.000000;,
    1.000000;0.000000;,
    0.000000;0.000000;,
    0.000000;0.000000;,
    0.000000;0.000000;,
    0.000000;0.000000;,
    0.500000;0.500000;,
    0.500000;0.500000;,
    0.500000;0.500000;,
    0.500000;0.500000;,
    0.160000;0.840000;,
    0.160000;0.840000;,
    0.160000;0.840000;,
    0.160000;0.160000;,
    0.160000;0.160000;,
    0.160000;0.160000;,
    0.840000;0.160000;,
    0.840000;0.160000;,
    0.840000;0.160000;,
    0.840000;0.840000;,
    0.840000;0.840000;,
    0.840000;0.840000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;,
    0.000000;1.000000;;
   }

   VertexDuplicationIndices {
    128;
    127;
    0,
    0,
    0,
    0,
    4,
    4,
    4,
    4,
    8,
    8,
    8,
    8,
    12,
    12,
    12,
    12,
    16,
    16,
    16,
    16,
    20,
    20,
    20,
    23,
    23,
    23,
    26,
    26,
    26,
    29,
    29,
    29,
    32,
    32,
    34,
    34,
    36,
    36,
    38,
    38,
    40,
    40,
    42,
    42,
    44,
    44,
    46,
    46,
    48,
    48,
    50,
    50,
    52,
    52,
    54,
    54,
    56,
    56,
    58,
    58,
    60,
    60,
    62,
    62,
    64,
    64,
    66,
    66,
    68,
    68,
    70,
    70,
    72,
    72,
    74,
    74,
    76,
    76,
    78,
    78,
    80,
    80,
    82,
    82,
    84,
    84,
    86,
    86,
    88,
    88,
    90,
    90,
    92,
    92,
    94,
    94,
    96,
    96,
    98,
    98,
    100,
    100,
    102,
    102,
    104,
    104,
    106,
    106,
    108,
    108,
    110,
    110,
    112,
    112,
    114,
    114,
    116,
    116,
    118,
    118,
    120,
    120,
    122,
    122,
    124,
    124,
    126,
    126;
   }

   MeshMaterialList {
    1;
    62;
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0;

    Material {
     1.000000;1.000000;1.000000;1.000000;;
     51.200001;
     0.000000;0.000000;0.000000;;
     0.000000;0.000000;0.000000;;
     TextureFilename {
      "tex64.png";
     }
    }
   }
  }
 }
}
