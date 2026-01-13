import React from "react";
import { motion } from "framer-motion";
import { FiCalendar, FiClock } from "react-icons/fi";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Select, MenuItem, FormControl } from "@mui/material";

const theme = createTheme({
    palette: {
        primary: {
            main: "#CF848A",
        },
    },
    shape: {
        borderRadius: 10,
    },
});

const deliveryTimes = [
    { id: "10-12", label: "10:00 AM - 12:00 PM", value: "10:00 AM - 12:00 PM" },
    { id: "12-2", label: "12:00 PM - 2:00 PM", value: "12:00 PM - 2:00 PM" },
    { id: "2-4", label: "2:00 PM - 4:00 PM", value: "2:00 PM - 4:00 PM" },
    { id: "4-6", label: "4:00 PM - 6:00 PM", value: "4:00 PM - 6:00 PM" },
    { id: "6-8", label: "6:00 PM - 8:00 PM", value: "6:00 PM - 8:00 PM" },
];

const ScheduleSection = ({ deliveryOption, selectedDate, setSelectedDate, selectedTimeSlot, setSelectedTimeSlot }) => {
    return (
        <section className="bg-white border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FiCalendar className="text-[#CF848A]" />
                {deliveryOption === "delivery" ? "Delivery" : "Pickup"} Schedule
            </h2>

            <ThemeProvider theme={theme}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                <FiCalendar className="inline mr-2" />
                                Select Date
                            </label>

                            <DatePicker
                                value={selectedDate}
                                onChange={(newValue) => setSelectedDate(newValue)}
                                minDate={dayjs()}
                                maxDate={dayjs().add(365, "day")}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        placeholder: "Choose delivery date",
                                    },
                                }}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                <FiClock className="inline mr-2" />
                                Select Time
                            </label>

                            <FormControl fullWidth>
                                <Select
                                    displayEmpty
                                    value={selectedTimeSlot}
                                    onChange={(e) => setSelectedTimeSlot(e.target.value)}
                                    sx={{
                                        borderRadius: "10px",
                                        backgroundColor: "#fff",
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "#D1D5DB",
                                        },
                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "#CF848A",
                                        },
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "#CF848A",
                                            borderWidth: 2,
                                        },
                                    }}
                                >
                                    <MenuItem disabled value="">
                                        <span className="text-gray-400">Choose a time slot</span>
                                    </MenuItem>

                                    {deliveryTimes.map((time) => (
                                        <MenuItem key={time.id} value={time.value}>
                                            {time.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                    </div>
                </LocalizationProvider>
            </ThemeProvider>

            {selectedDate && selectedTimeSlot && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-6 p-4 bg-gradient-to-r from-[#FDE9EE] to-[#F8C6D0] border border-[#F3D6D6]"
                >
                    <p className="text-[#A85C68] font-medium text-center">
                        📅 {deliveryOption === "delivery" ? "Delivery" : "Pickup"} scheduled for{" "}
                        <span className="font-bold">
                            {selectedDate.format("dddd, MMMM D, YYYY")} at {selectedTimeSlot}
                        </span>
                    </p>
                </motion.div>
            )}
        </section>
    );
};

export default ScheduleSection;