import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Ionicons } from '@expo/vector-icons'
import { deleteUser } from '../redux/DataSlice'
import AntDesign from '@expo/vector-icons/AntDesign';

const ListUsers = ({ listId }) => {
  const dispatch = useDispatch()
  const currentList = useSelector(state =>
    state.userData.data.find(item => item.id === listId)
  );

  const sharedWithUsers = currentList?.sharedWithUserData || [];
  const invitePendingUids = currentList?.invitePending || [];

  const createdByUser = currentList?.createdByUserData || null;

  const allUsersMap = useSelector(state => {
    const map = {};
    state.userData.data.forEach(list => {
      if (list.createdByUserData) {
        map[list.createdByUserData.uid] = list.createdByUserData;
      }
      if (list.sharedWithUserData) {
        list.sharedWithUserData.forEach(u => {
          map[u.uid] = u;
        });
      }
    });
    return map;
  });

  const invitePendingUsers = invitePendingUids.map(uid => allUsersMap[uid]).filter(Boolean);

  return (
    <View style={styles.container}>
      {createdByUser && (
        <View style={[styles.listContainer, styles.creatorContainer]}>
          <Text style={styles.sectionTitle}>List Creator</Text>
          <View style={styles.userItem}>
            <Ionicons name="person-circle" size={26} color="#2980b9" />
            <Text style={[styles.userName, styles.creatorName]}>{createdByUser.name} {createdByUser.surname || ''}</Text>
          </View>
        </View>
      )}

      {sharedWithUsers.length > 0 && (
        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>Shared With</Text>
          {sharedWithUsers.map(user => (
            <View key={user.uid} style={styles.userItem}>
              <Ionicons name="person" size={22} color="#34495e" />
              <Text style={styles.userName}>{user.name}</Text>
              {
                createdByUser && (
                  <Pressable onPress={() => {dispatch(deleteUser({listId, userUid: user.uid}))}}>
                    <AntDesign name="deleteuser" size={24} color="red" />
                  </Pressable>
                )
              }
              
              
            </View>
          ))}
        </View>
      )}

      {invitePendingUsers.length > 0 && (
        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>Pending Invites</Text>
          {invitePendingUsers.map(user => (
            <View key={user.uid} style={styles.userItem}>
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
