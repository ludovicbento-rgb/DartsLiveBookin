import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/fr";

interface Props {

    value: Date;

    onChange: (
        date: Date,
    ) => void;

}

export function PlanningDateSelector({

    value,

    onChange,

}: Props) {

    return (

        <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="fr"
        >

            <DatePicker

                label="Date souhaitée"

                value={dayjs(value)}

                minDate={dayjs()}

                maxDate={dayjs().add(3, "month")}

                format="DD/MM/YYYY"

                onChange={(newValue: Dayjs | null) => {

                    if (!newValue) {
                        return;
                    }

                    onChange(
                        newValue.toDate(),
                    );

                }}

                slotProps={{

                    textField: {

                        fullWidth: true,

                    },

                }}

            />

        </LocalizationProvider>

    );

}

export default PlanningDateSelector;    