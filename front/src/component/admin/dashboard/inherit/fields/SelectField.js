import { Autocomplete, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import '../../main.css';


export const CustomSelectField = (props) => {
    return (
        <FormControl className="admin-field" required sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-required-label"> {props.label} </InputLabel>
            <Select
                dir='ltr'
                labelId="demo-simple-select-required-label"
                id="demo-simple-select-required"
                value={props.value}
                defaultValue={props.defaultValue}
                label={props.label}
                onChange={props.onChange}
                name={props.name}
            >
                <MenuItem value="">
                    <em>-------</em>
                </MenuItem>
                {

                    props.array.map((g) => {
                        return (
                            <MenuItem className='menu-select-item' key={g.id} value={g.id}>{g.name}</MenuItem>
                        )
                    })
                }
            </Select>
        </FormControl>
    )
}

export const CustomSelectAutocompleteField = (props) => {
    return (
        <FormControl className="admin-field p-0 m-0" required sx={{ m: 1, minWidth: 120 }}>
            <Autocomplete
                disablePortal
                options={props.array}
                getOptionLabel={(option) => `${option.name} (${option.id})`} // يظهر الاسم والـ id
                value={
                    props.array.find((item) => item.id === props.value) || null
                }
                onChange={(event, newValue) => {
                    props.onChange({
                        target: { name: props.name, value: newValue ? newValue.id : "" },
                    });
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={props.label}
                        required
                    />
                )}
                sx={{ m: 1, minWidth: 250 }}
            />
        </FormControl>
    );
};
