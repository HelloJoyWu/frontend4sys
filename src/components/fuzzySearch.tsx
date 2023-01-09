import React, {useState} from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';

/**
 * data:option data [{value:""},{value:""},{value:""}]
 * index: z-index sort,The higher the area, the higher
 * promptText:Default prompt text
 */

interface Props {
  data: any;
  index: number;
  promptText: string;
}

const FuzzySearch: React.FC<Props> = data => {
  const [ownerValue, setOwnerValue] = useState('');
  const [changeText, setChangeText] = useState('');
  const [showSelect, setShowSelect] = useState(false);

  const renderSelectItem = (dataArray: any) => {
    return dataArray.map((item: any) => {
      const valueText = changeText.toLowerCase();
      const valueItem = item.value.toLowerCase();

      if (!valueItem.includes(valueText)) {
        return;
      }

      return (
        <TouchableOpacity
          onPress={() => {
            setOwnerValue(item.value);
            setChangeText('');
            setShowSelect(false);
          }}>
          <View>
            <Text style={styles.seleceOptionBox}>{item.value}</Text>
          </View>
          <View style={{height: 1, backgroundColor: '#7b7b7b'}} />
        </TouchableOpacity>
      );
    });
  };

  const showOption = () => {
    return showSelect ? (
      <ScrollView style={styles.optionBox}>
        {renderSelectItem(data.data)}
      </ScrollView>
    ) : null;
  };

  return (
    <View style={{padding: 20, zIndex: data.index}}>
      <TextInput
        onChangeText={value => {
          setChangeText(value);
          setOwnerValue(value);
          setShowSelect(true);
        }}
        placeholder={data.promptText}
        placeholderTextColor={'#6F7485'}
        autoCapitalize="none"
        style={styles.selectBox}
        value={ownerValue}
        onFocus={() => {
          setShowSelect(true);
        }}
        onBlur={() => setShowSelect(false)}
        clearTextOnFocus={true}
      />
      {showOption()}
    </View>
  );
};

const styles = StyleSheet.create({
  selectBox: {
    borderRadius: 40,
    backgroundColor: '#25303A',
    borderColor: '#FFFFFF',
    borderWidth: 2,
    height: 50,
    width: '100%',
    paddingHorizontal: 15,
    justifyContent: 'center',
    fontSize: 20,
    color: '#FFFFFF',
  },
  seleceOptionBox: {
    fontSize: 18,
    color: '#FFFFFF',
    padding: 10,
  },
  optionBox: {
    position: 'absolute',
    width: '100%',
    backgroundColor: '#555555',
    marginHorizontal: 20,
    marginTop: 60,
    borderRadius: 10,
    height: 200,
  },
});

export default FuzzySearch;
