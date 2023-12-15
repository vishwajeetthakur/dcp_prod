import { useContext } from 'react';
import { colorModeContext } from '../contexts';

const useColorMode = () => useContext(colorModeContext);
export default useColorMode;