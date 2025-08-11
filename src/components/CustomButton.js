import { Pressable, 
    StyleSheet,
    View,
    Text,
} from "react-native"

const CustomButton = ({title,HandleonPress,handleWidth,handleBackground,handleTextColor}) =>{
    return(
        <View style = {[styles.container,{ backgroundColor: handleBackground}]}>
            <Pressable
                onPress={HandleonPress}
                style={[styles.pressableContainer,{width : handleWidth}]}
            >
                <Text style = {[styles.text, {color: handleTextColor,}]}>{title}</Text>
            </Pressable>
        </View>
    )
}

export default CustomButton;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 35,
        padding: 10,
        marginVertical: 5,
    },
    pressableContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 3,
    },
    text: {
        fontWeight: 'bold',
        fontSize: 16,
        marginRight: 10,
        textAlign: 'center',
        flex:1
    },

})