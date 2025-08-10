import { StyleSheet, Text, View } from 'react-native'
import { LogOut } from '../redux/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import CustomButton from './CustomButton'
import { setShowProfileBox } from '../redux/TriggerSlice'

const ProfileBox = () => {
  const dispatch = useDispatch()

  const email = useSelector(state => state.user.user.email)

  return (
    <View>
      <View style={styles.profileInfoContainer}>
        <Text style={styles.emailText}> Email: {email}</Text>
      </View>

      <View style={styles.logoutButtonContainer}>
        <CustomButton
          title={'Log Out'}
          HandleonPress={() => {
            dispatch(setShowProfileBox(true))
            dispatch(LogOut());
          }}
          handleWidth={'80%'}
          handleBackground={'#e74c3c'}
          handleTextColor={'#ffffff'}
        />
      </View>
    </View>
  )
}

export default ProfileBox

const styles = StyleSheet.create({
  profileInfoContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth, // Use a thin, crisp line for a separator
    borderBottomColor: '#e0e0e0',
    paddingBottom: 15,
    marginBottom: 15,
  },
  emailText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500', // Use a slightly bolder font weight
  },
})