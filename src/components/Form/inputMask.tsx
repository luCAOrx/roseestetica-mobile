import React, { useState, useCallback, forwardRef } from 'react';

import { 
  TextInputMask, 
  TextInputMaskProps, 
  TextInputMaskTypeProp
} from 'react-native-masked-text';

import Input from './input';

interface InputMaskProps extends TextInputMaskProps {
   type: TextInputMaskTypeProp;
   icon: string;
   name: string;
}

interface InputHandles {
  focus(): void;
}

const InputMask: React.ForwardRefRenderFunction<InputHandles,InputMaskProps> = ({
   type,
   icon,
   name,
  ...rest 
}, inputRef) => {
  const [text, setText] = useState('');
  const [rawText, setRawText] = useState('');
  
  const handleChangeText = useCallback((maskedText, unmaskedText) => {
    setText(maskedText);

    setRawText(unmaskedText);
  }, []);

  return (
    <TextInputMask
      type={type}
      includeRawValueInChangeText
      value={text}
      onChangeText={handleChangeText}
      customTextInput={Input}
      customTextInputProps={{
        ref: inputRef,
        icon,
        name,
        rawText,
        onInitialData: setText,
      }}
      {...rest}
    />
  );
};

export default forwardRef(InputMask);