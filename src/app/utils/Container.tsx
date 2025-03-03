import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-center px-1 sm:px-2">
      {children}
    </div>
  );
};

export default Container;
