import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { deleteUser } from '../redux/DataSlice';
import AntDesign from '@expo/vector-icons/AntDesign';
import { createSelector } from '@reduxjs/toolkit';

const ListUsers = ({ listId }) => {
  const dispatch = useDispatch();

  // Memoized selector for current list
  const selectCurrentList = createSelector(
    [state => state.userData.data],
    data => data.find(item => item.id === listId)
  );
  const currentList = useSelector(selectCurrentList);
  const currentUserUid = useSelector(state => state.user.userUid)

  // Memoized selector for all users map
  const selectAllUsersMap = createSelector(
    [state => state.userData.data],
    data => {
      const map = {};
      data.forEach(list => {
        if (list.createdByUserData) {
          map[list.createdByUserData.userUid] = list.createdByUserData;
        }
        if (list.sharedWithUserData) {
          list.sharedWithUserData.forEach(u => {
            map[u.userUid] = u;
          });
        }
        console.log('createdByUserData', list.createdByUserData)
        console.log('sharedWithUserData', list.sharedWithUserData)
      });
      return map;
    }
  );
  const allUsersMap = useSelector(selectAllUsersMap);

  const sharedWithUsers = currentList?.sharedWithUserData || [];
  const invitePendingUids = currentList?.invitePending || [];
  const createdByUser = currentList?.createdByUserData || null;

  const isCreatedByUser = currentUserUid === createdByUser.userUid

  // Prepare users with proper keys
  const invitePendingUsers = invitePendingUids
    .map(uid => allUsersMap[uid])
    .filter(Boolean)
    .map(user => ({ ...user, key: user.uid || `pending-${Math.random()}` })
  )

  const sharedWithUsersWithKeys = sharedWithUsers.map(user => ({
    ...user,
    key: user.userUid || `shared-${Math.random()}`
  }));

  const handleDeleteUser = (userUid) => {
    if (!userUid) {
      console.error("Cannot delete user: UID is undefined!");
      return;
    }
    console.log("Deleting user UID:", userUid);
    dispatch(deleteUser({ listId, userUid }));
  };

  return (
    <View style={styles.container}>
      {createdByUser && (
        <View style={[styles.listContainer, styles.creatorContainer]}>
          <Text style={styles.sectionTitle}>List Creator</Text>
          <View style={styles.userItem}>
            <Ionicons name="person-circle" size={26} color="#2980b9" />
            <Text style={[styles.userName, styles.creatorName]}>
              {createdByUser.name} {createdByUser.surname || ''}
            </Text>
          </View>
        </View>
      )}

      {sharedWithUsersWithKeys.length > 0 && (
        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>Shared With</Text>
          {sharedWithUsersWithKeys.map(user => (
            <View key={user.key} style={styles.userItem}>
              <Ionicons name="person" size={22} color="#34495e" />
              <Text style={styles.userName}>{user.name}</Text>
              {isCreatedByUser && (
                <Pressable
                  onPress={() => handleDeleteUser(user.key)}
                  style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
                >
                  <AntDesign name="deleteuser" size={24} color="red" />
                </Pressable>
              )}
            </View>
          ))}
        </View>
      )}

      {invitePendingUsers.length > 0 && (
        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>Pending Invites</Text>
          {invitePendingUsers.map(user => (
            <View key={user.key} style={styles.userItem}>
              <Ionicons name="mail" size={22} color="#7f8c8d" />
              <Text style={[styles.userName, styles.pendingName]}>{user.name}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default ListUsers;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    maxHeight: 300,
  },
  listContainer: {
    marginBottom: 18,
  },
  creatorContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#dcdcdc',
    paddingBottom: 12,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 18,
    color: '#2c3e50',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userName: {
    marginLeft: 14,
    fontSize: 16,
    color: '#34495e',
  },
  creatorName: {
    color: '#2980b9',
    fontWeight: '700',
  },
  pendingName: {
    fontStyle: 'italic',
    color: '#7f8c8d',
  },
});