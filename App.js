// App.js
import React, { useState } from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import MessageScreen from './screens/MessageScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [directories, setDirectories] = useState([
    { id: '1', title: 'University Announcements' },
    { id: '2', title: 'Club Notices' },
    { id: '3', title: 'Event Alerts' },
    { id: '4', title: 'Emergency Updates' },
  ]);

  const [messagesMap, setMessagesMap] = useState({
    'University Announcements': [
      'Semester starts on September 5',
      'Fee deadline: August 25',
      'Midterms start in October',
    ],
    'Club Notices': [
      'Coding Club meets every Friday',
      'Dance Club auditions on Sept 10',
      'Photography Club field trip on Sept 15',
    ],
    'Event Alerts': [
      'Hackathon this weekend!',
      'Tech Talk by Google Engineer on Sept 20',
      'Annual Fest on Nov 1–3',
    ],
    'Emergency Updates': [
      'COVID-19 protocols updated',
      'Storm warning for Thursday',
      'Fire drill scheduled next week',
    ],
  });

  // Add a new group/directory with optional initial message
  const addGroup = (newTitle, initialMessage) => {
    const title = newTitle.trim();
    if (!title || messagesMap[title]) return;
    setDirectories(d => [...d, { id: Date.now().toString(), title }]);
    setMessagesMap(m => ({
      ...m,
      [title]: initialMessage.trim() ? [initialMessage.trim()] : []
    }));
  };

  // Edit a group/directory name
  const editGroup = (oldTitle, newTitle) => {
    setDirectories(dirs =>
      dirs.map(dir =>
        dir.title === oldTitle ? { ...dir, title: newTitle } : dir
      )
    );
    setMessagesMap(msgs => {
      const { [oldTitle]: oldMsgs, ...rest } = msgs;
      return {
        ...rest,
        [newTitle]: oldMsgs || []
      };
    });
  };

  // Delete a group/directory and all its messages
  const deleteGroup = title => {
    setDirectories(dirs => dirs.filter(dir => dir.title !== title));
    setMessagesMap(msgs => {
      const { [title]: _, ...rest } = msgs;
      return rest;
    });
  };

  // Message handlers
  const addMessage = (groupTitle, text) => {
    setMessagesMap(m => ({
      ...m,
      [groupTitle]: [...m[groupTitle], text]
    }));
  };
  const editMessage = (groupTitle, idx, text) => {
    setMessagesMap(m => ({
      ...m,
      [groupTitle]: m[groupTitle].map((x, i) => (i === idx ? text : x))
    }));
  };
  const deleteMessage = (groupTitle, idx) => {
    setMessagesMap(m => ({
      ...m,
      [groupTitle]: m[groupTitle].filter((_, i) => i !== idx)
    }));
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" options={{ title: 'Directories' }}>
          {props => (
            <HomeScreen
              {...props}
              directories={directories}
              messagesMap={messagesMap}
              addGroup={addGroup}
              editGroup={editGroup}
              deleteGroup={deleteGroup}
            />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="MessageScreen"
          options={({ route }) => ({ title: route.params.title })}
        >
          {props => (
            <MessageScreen
              {...props}
              messagesMap={messagesMap}
              addMessage={addMessage}
              editMessage={editMessage}
              deleteMessage={deleteMessage}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
