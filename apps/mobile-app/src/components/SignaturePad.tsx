import React, { useRef } from 'react';
// Utilizaremos react-native-signature-canvas para una captura fluida
import SignatureScreen from 'react-native-signature-canvas';

interface Props {
  onOK: (signature: string) => void; // Recibe la firma en base64
  descriptionText: string;
}

const SignaturePad: React.FC<Props> = ({ onOK, descriptionText }) => {
  const ref = useRef(null);

  const handleSignature = (signature: string) => {
    // Aquí recibimos el string de la imagen para subirlo al bucket de GeoTrack
    onOK(signature);
  };

  return (
    <div className="flex-1 p-4 bg-white">
      <h3 className="text-lg font-semibold mb-2 text-slate-700">{descriptionText}</h3>
      <div className="h-64 border-2 border-dashed border-slate-300 rounded-lg overflow-hidden">
        <SignatureScreen
          ref={ref}
          onOK={handleSignature}
          descriptionText="Firme aquí para confirmar recibido"
          clearText="Borrar"
          confirmText="Guardar Evidencia"
        />
      </div>
    </div>
  );
};

export default SignaturePad;