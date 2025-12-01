import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";

type AddDueDateMenuProps = {
  onSelect: (value: "today" | "tomorrow" | "next_week" | "pick_date") => void;
  colors: any;
  styles: any; // You already pass styles from TaskDetails, so keep it flexible
};

const AddDueDateMenu: React.FC<AddDueDateMenuProps> = ({
  onSelect,
  colors,
  styles,
}) => {
  return (
    <Menu>
      <MenuTrigger
        customStyles={{
          TriggerTouchableComponent: TouchableOpacity,
          triggerWrapper: {
            flexDirection: "row",
            alignItems: "center",
          },
        }}
      >
        <View style={styles.optionRow}>
          <Ionicons
            name="calendar-outline"
            size={20}
            color={colors.textPrimary}
          />
          <Text style={styles.optionText}>Add due date</Text>
        </View>
      </MenuTrigger>

      <MenuOptions customStyles={{ optionsContainer: styles.menuContainer }}>
        {/* TODAY */}
        <MenuOption onSelect={() => onSelect("today")}>
          <View style={styles.menuRow}>
            <Ionicons
              name="today-outline"
              size={18}
              color={colors.textPrimary}
              style={styles.menuIcon}
            />
            <Text style={styles.menuLabel}>Today</Text>
          </View>
        </MenuOption>

        {/* TOMORROW */}
        <MenuOption onSelect={() => onSelect("tomorrow")}>
          <View style={styles.menuRow}>
            <Ionicons
              name="sunny-outline"
              size={18}
              color={colors.textPrimary}
              style={styles.menuIcon}
            />
            <Text style={styles.menuLabel}>Tomorrow</Text>
          </View>
        </MenuOption>

        {/* NEXT WEEK */}
        <MenuOption onSelect={() => onSelect("next_week")}>
          <View style={styles.menuRow}>
            <Ionicons
              name="calendar-outline"
              size={18}
              color={colors.textPrimary}
              style={styles.menuIcon}
            />
            <Text style={styles.menuLabel}>Next week</Text>
          </View>
        </MenuOption>

        {/* PICK DATE (Optional) */}
        <MenuOption onSelect={() => onSelect("pick_date")}>
          <View style={styles.menuRow}>
            <Ionicons
              name="calendar-number-outline"
              size={18}
              color={colors.textPrimary}
              style={styles.menuIcon}
            />
            <Text style={styles.menuLabel}>Pick a date</Text>
          </View>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );
};

export default AddDueDateMenu;
