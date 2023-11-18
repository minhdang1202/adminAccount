import { Spin } from 'antd';
import { ReactNode, createContext, useState } from 'react';

interface ILoadingContext {
  show: () => void;
  hide: () => void;
}

const LoadingContext = createContext<ILoadingContext | null>(null);

type LoadingContextProps = {
  children: ReactNode;
};

const LoadingProvider = (props: LoadingContextProps) => {
  const [isLoadingGlobal, setIsLoadingGlobal] = useState<boolean>(false);

  const contextValue = {
    show: () => setIsLoadingGlobal(true),
    hide: () => setIsLoadingGlobal(false),
  };

  return (
    <LoadingContext.Provider value={contextValue}>
      {props.children}
      {isLoadingGlobal && (
        <div className='loading_wrapper_global'>
          <Spin size='large' />
        </div>
      )}
    </LoadingContext.Provider>
  );
};

export { LoadingContext, LoadingProvider };
