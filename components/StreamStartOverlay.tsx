import { useState } from 'react';
import { Modal, ModalContent, Button } from "@nextui-org/react";
import { Sparkle } from "@phosphor-icons/react";

interface StreamStartOverlayProps {
  onStart: () => void;
}

export default function StreamStartOverlay({ onStart }: StreamStartOverlayProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleStart = () => {
    setIsVisible(false);
    onStart();
  };

  return (
    <Modal 
      isOpen={isVisible} 
      onClose={() => {}}
      hideCloseButton
      className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-md"
    >
      <ModalContent className="py-8 px-6">
        <div className="flex flex-col items-center gap-6">
          <div className="rounded-full bg-gradient-to-r from-pink-500 to-violet-500 p-3">
            <Sparkle size={32} className="text-white" weight="fill" />
          </div>
          
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
            Welcome to HeyShop Live!
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 text-center">
            Get ready for an interactive shopping experience with our AI host! Click below to start the session.
          </p>

          <Button
            className="bg-gradient-to-r from-pink-500 to-violet-500 text-white font-semibold px-8 py-6"
            size="lg"
            onClick={handleStart}
          >
            Start Live Shopping Experience 🎉
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
}