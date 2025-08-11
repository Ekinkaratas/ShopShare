import { View, Text, TextInput, StyleSheet, Pressable, Image } from 'react-native';
import React, { useState } from 'react';

const CustomTextInputForPassword = ({
  title,
  handlePlaceHolder,
  handleMod,
  HandleOnChange,
  handleValue,
  handleSecurityText,
  handleTitleColor,
}) => {
  const [isHidden, setIsHidden] = useState(handleSecurityText);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: handleTitleColor }]}>{title}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          value={handleValue}
          onChangeText={HandleOnChange}
          placeholder={handlePlaceHolder}
          secureTextEntry={isHidden}
          inputMode={handleMod}
          style={styles.input}
        />

        {handleSecurityText && (
          <Pressable onPress={() => setIsHidden(!isHidden)} style={styles.iconContainer}>
            <Image
              source={
                isHidden
                  ? require('../../assets/imagesForPassword/hide.png')
                  : require('../../assets/imagesForPassword/witness.png')
              }
              style={styles.icon}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default CustomTextInputForPassword;

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
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    paddingHorizontal: 10, 
    paddingRight: 45,      
    height: 45,
  },
  iconContainer: {
    position: 'absolute',
    right: 10,
    height: '100%',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});