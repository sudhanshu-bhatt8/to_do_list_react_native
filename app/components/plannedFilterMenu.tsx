import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";

// Types of filters
export type PlannedFilterType =
  | "overdue"
  | "today"
  | "tomorrow"
  | "this_week"
  | "later"
  | "all";

type Props = {
  selectedFilter: PlannedFilterType;
  onSelect: (value: PlannedFilterType) => void;
};

const PlannedFilterMenu: React.FC<Props> = ({ selectedFilter, onSelect }) => {
  return (
    <Menu>
      {/* TRIGGER BUTTON */}
      <MenuTrigger
        customStyles={{
          TriggerTouchableComponent: TouchableOpacity,
          triggerWrapper: styles.triggerWrapper,
        }}
      >
        <View style={styles.triggerContent}>
          <Ionicons name="menu-outline" size={20} color="#A9DCD6" />
          <Text style={styles.triggerText}>
            {getFilterLabel(selectedFilter)}
          </Text>
        </View>
      </MenuTrigger>

      {/* DROPDOWN MENU */}
      <MenuOptions customStyles={{ optionsContainer: styles.menuContainer }}>
        {/* Overdue */}
        <MenuOption onSelect={() => onSelect("overdue")}>
          <View style={styles.menuRow}>
            <Ionicons name="calendar-clear-outline" size={20} color="#fff" />
            <Text style={styles.menuLabel}>Overdue</Text>
          </View>
        </MenuOption>

        {/* Today */}
        <MenuOption onSelect={() => onSelect("today")}>
          <View style={styles.menuRow}>
            <Ionicons name="calendar-outline" size={20} color="#fff" />
            <Text style={styles.menuLabel}>Today (Tue)</Text>
          </View>
        </MenuOption>

        {/* Tomorrow */}
        <MenuOption onSelect={() => onSelect("tomorrow")}>
          <View style={styles.menuRow}>
            <Ionicons name="calendar-outline" size={20} color="#fff" />
            <Text style={styles.menuLabel}>Tomorrow (Wed)</Text>
          </View>
        </MenuOption>

        {/* This Week */}
        <MenuOption onSelect={() => onSelect("this_week")}>
          <View style={styles.menuRow}>
            <Ionicons name="calendar-number-outline" size={20} color="#fff" />
            <Text style={styles.menuLabel}>This week (2 - 8 Dec)</Text>
          </View>
        </MenuOption>

        {/* Later */}
        <MenuOption onSelect={() => onSelect("later")}>
          <View style={styles.menuRow}>
            <Ionicons name="cloud-download-outline" size={20} color="#fff" />
            <Text style={styles.menuLabel}>Later</Text>
          </View>
        </MenuOption>

        {/* All Planned */}
        <MenuOption onSelect={() => onSelect("all")}>
          <View style={styles.menuRow}>
            <Ionicons name="calendar-sharp" size={20} color="#fff" />
            <Text style={styles.menuLabel}>All planned</Text>
          </View>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );
};

export default PlannedFilterMenu;

const styles = StyleSheet.create({
  triggerWrapper: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#1F1F1F",
    borderRadius: 8,
  },
  triggerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  triggerText: {
    color: "#A9DCD6",
    fontSize: 15,
    fontWeight: "600",
  },
  menuContainer: {
    backgroundColor: "#2B2B2B",
    paddingVertical: 6,
    width: 230,
    borderRadius: 10,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
  },
  menuLabel: {
    color: "#fff",
    fontSize: 16,
  },
});

// Label helper
function getFilterLabel(filter: PlannedFilterType) {
  //   console.log(filter, "check_filter");
  switch (filter) {
    case "overdue":
      return "Overdue";
    case "today":
      return "Today";
    case "tomorrow":
      return "Tomorrow";
    case "this_week":
      return "This week";
    case "later":
      return "Later";
    default:
      return "All planned";
  }
}
