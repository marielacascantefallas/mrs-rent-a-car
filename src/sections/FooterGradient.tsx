import { GrainGradient } from '@paper-design/shaders-react';

type Props = {
  dark: boolean;
  still: boolean;
};

// Colinas onduladas con grano, pintadas exactamente en los colores de marca.
// Se carga aparte (React.lazy) para no frenar la carga inicial del sitio.
export default function FooterGradient({ dark, still }: Props) {
  return (
    <GrainGradient
      style={{ position: 'absolute', inset: 0 }}
      shape="wave"
      colorBack={dark ? '#0f1f0f' : '#eae3d2'}
      // Bandas alternadas: colinas amarillas y verdes, una detrás de otra.
      colors={['#ffd401', '#1f3f1f', '#ffd401', '#1f3f1f']}
      softness={0.6}
      intensity={0.15}
      noise={0.35}
      speed={still ? 0 : 0.4}
      scale={0.8}
      rotation={0}
    />
  );
}
