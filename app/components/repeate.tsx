import { RepeatType } from "@/store/tasksSlice";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
type AddRepeatMenuProps = {
  onSelect: (value: RepeatType) => void;
  colors: any;
  styles: any;
};

const AddRepeatMenu: React.FC<AddRepeatMenuProps> = ({
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
            name="repeat-outline"
            size={20}
            color={colors.textPrimary}
          />
          <Text style={styles.optionText}>Repeat</Text>
        </View>
      </MenuTrigger>

      <MenuOptions customStyles={{ optionsContainer: styles.menuContainer }}>
        <MenuOption onSelect={() => onSelect("daily")}>
          <View style={styles.menuRow}>
            <Ionicons
              name="today-outline"
              size={18}
              color={colors.textPrimary}
              style={styles.menuIcon}
            />
            <Text style={styles.menuLabel}>Daily</Text>
          </View>
        </MenuOption>

        <MenuOption onSelect={() => onSelect("weekly")}>
          <View style={styles.menuRow}>
            <Ionicons
              name="calendar-outline"
              size={18}
              color={colors.textPrimary}
              style={styles.menuIcon}
            />
            <Text style={styles.menuLabel}>Weekly</Text>
          </View>
        </MenuOption>

        <MenuOption onSelect={() => onSelect("monthly")}>
          <View style={styles.menuRow}>
            <Ionicons
              name="calendar-number-outline"
              size={18}
              color={colors.textPrimary}
              style={styles.menuIcon}
            />
            <Text style={styles.menuLabel}>Monthly</Text>
          </View>
        </MenuOption>

        <MenuOption onSelect={() => onSelect("yearly")}>
          <View style={styles.menuRow}>
            <Ionicons
              name="calendar-clear-outline"
              size={18}
              color={colors.textPrimary}
              style={styles.menuIcon}
            />
            <Text style={styles.menuLabel}>Yearly</Text>
          </View>
        </MenuOption>

        <MenuOption onSelect={() => onSelect("none")}>
          <View style={styles.menuRow}>
            <Ionicons
              name="close-outline"
              size={18}
              color={colors.textPrimary}
              style={styles.menuIcon}
            />
            <Text style={styles.menuLabel}>No repeat</Text>
          </View>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );
};

export default AddRepeatMenu;
