precision highp float;

varying vec3 vNormal;

void main()	{
  vec3 mattColor = (normalize(vNormal)+1.0)/2.0;
  gl_FragColor = vec4(mattColor,1.0);
}