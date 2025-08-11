import { View, Text, TextInput, StyleSheet } from 'react-native';

const CustomTextInput = ({
  title,
  handlePlaceHolder,
  handleMod,
  HandleOnChange,
  handleValue,
  handleSecurityText,
  handleTitleColor,
}) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.label,{color: handleTitleColor,}]}>{title}</Text>
      <TextInput
        value={handleValue}
        onChangeText={HandleOnChange}
        placeholder={handlePlaceHolder}
        secureTextEntry={handleSecurityText}
        inputMode={handleMod}
        style={styles.input}
      />
    </View>
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    width: '80%',
  },
  label: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    borderRadius: 15,
    height: 45, 
  },
});
