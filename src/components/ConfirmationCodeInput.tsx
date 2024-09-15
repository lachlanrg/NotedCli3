import React from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import { dark, gray, light } from './colorModes';

type ConfirmationCodeInputProps = {
  value: string;
  setValue: (value: string) => void;
  onComplete: (confirmationCode: string) => void;
};

const CELL_COUNT = 6;

const ConfirmationCodeInput: React.FC<ConfirmationCodeInputProps> = ({ value, setValue, onComplete }) => {
    const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
      value,
      setValue,
    });
  
    return (
        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={(code) => {
            setValue(code);
            if (code.length === CELL_COUNT) {
                // Trim any potential leading/trailing spaces
                onComplete(code.trim());
            }
        }}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({index, symbol, isFocused}) => (
            <View
              // Make sure that you pass onLayout={getCellOnLayoutHandler(index)} prop to root component of "Cell"
              onLayout={getCellOnLayoutHandler(index)}
              key={index}
              style={[styles.cellRoot, isFocused && styles.focusCell]}>
              <Text style={styles.cellText}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            </View>
          )}
        />
    );
  };

  const styles = StyleSheet.create({
    codeFieldRoot: {
    //   marginTop: 20,
      width: '90%',
      alignSelf: 'center',
      justifyContent: 'space-between',
      paddingBottom: 20,
    },
    cellRoot: {
      width: 40,
      height: 70,
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: gray,
    },
    cellText: {
      color: light,
      fontSize: 34,
      textAlign: 'center',
    },
    focusCell: {
      borderBottomColor: light,
      borderBottomWidth: 2,
    },
  });
  
export default ConfirmationCodeInput;
