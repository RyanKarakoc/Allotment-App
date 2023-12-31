import {
  Alert,
  Modal,
  Pressable,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { formatDate } from "../../utils/utils";
import { addPlantToAllotment } from "../../../firebase/database";
import { PlantType } from "../../../types/Plants.types";
import { useNavigation } from "@react-navigation/native";
import { SinglePlantStyles } from "../SinglePlantScreen.style";

const DateModal = ({
  modalVisible,
  setModalVisible,
  plantName,
  plant,
  currentUser,
  setExistsInAllotment,
}: {
  modalVisible: boolean;
  setModalVisible: (bool: boolean) => void;
  plantName: string;
  plant: PlantType | undefined;
  currentUser: any;
  setExistsInAllotment: (bool: boolean) => void;
}) => {
  const defaultDate = new Date();
  const [date, setDate] = useState<string>(formatDate(defaultDate));
  const [showDate, setShowDate] = useState<boolean>(false);
  const navigation = useNavigation<any>();

  const handleOnChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(formatDate(selectedDate));
      setShowDate(false);
    }
  };

  const createTwoButtonAlert = () =>
    Alert.alert(
      "Added to your allotment",
      `${plantName} added to your allotment`,
      [
        {
          text: "OK",
          onPress: () => {
            console.log("OK Pressed");
          },
          style: "cancel",
        },
        {
          text: "Go to allotment",
          onPress: () => navigation.navigate("My Allotment"),
        },
      ]
    );

  const addToAllotment = () => {
    addPlantToAllotment(currentUser.id, plant, date);
    setModalVisible(!modalVisible);
    createTwoButtonAlert();
    setExistsInAllotment(true);
    // needs to change "Ryan to a user Id"
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        setModalVisible(!modalVisible);
      }}
    >
      <View style={SinglePlantStyles.centeredView}>
        <View style={SinglePlantStyles.modalView}>
          <Text style={SinglePlantStyles.modalText}>
            What day did you sow {plantName} to your allotment? 🌱
            {/* {plantName} have been added to your allotment! ✅ */}
          </Text>
          <Text>Date planted: {date.toLocaleString()}</Text>
          {showDate ? (
            <DateTimePicker
              value={new Date(date)}
              mode="date"
              display="spinner"
              textColor="#000000"
              onChange={handleOnChange}
            />
          ) : (
            <TouchableOpacity
              onPress={() => {
                setShowDate(true);
              }}
            >
              <Text>Change Date</Text>
            </TouchableOpacity>
          )}
          <View style={{ display: "flex", width: "100%" }}>
            <TouchableOpacity
              style={SinglePlantStyles.cancel}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={SinglePlantStyles.textStyle}>dismiss</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={SinglePlantStyles.confirm}
              onPress={addToAllotment}
            >
              <Text style={SinglePlantStyles.textStyle}>
                Add to my allotment
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DateModal;
