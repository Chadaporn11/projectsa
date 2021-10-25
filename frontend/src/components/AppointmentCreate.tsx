import React from "react";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import MenuItem from '@material-ui/core/MenuItem';
import SaveIcon from '@material-ui/icons/Save';
import Divider from "@material-ui/core/Divider";
import Snackbar from '@material-ui/core/Snackbar';
import Select from "@material-ui/core/Select";
import { FormControl } from "@material-ui/core";

import { NursesInterface } from "../models/INurse";
import { DoctorsInterface } from "../models/IDoctor";
import { ClinicsInterface } from "../models/IClinic";
import { PatientsInterface } from "../models/IPatient";
import { AppointmentInterface } from "../models/IAppointment";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";



function Alert(props: AlertProps) {

  return <MuiAlert elevation={2} variant="filled" {...props} />;

}


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    container: {
      marginTop: theme.spacing(2),
    },
    paper: {
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
    },
  })
);

function AppointmentCreate() {

  const classes = useStyles();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [doctors, setDoctors] = useState<DoctorsInterface[]>([]);
  const [nurses, setNurses] = useState<NursesInterface>();
  const [clinics, setClinics] = useState<ClinicsInterface[]>([]);
  const [patients, setPatients] = useState<PatientsInterface[]>([]);
  const [appointment, setAppointment] = useState<Partial<AppointmentInterface>>(
    {}
  );
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const apiUrl = "http://localhost:8080";
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccess(false);
    setError(false);
  };

  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const name = event.target.name as keyof typeof appointment;
    setAppointment({
      ...appointment,
      [name]: event.target.value,
    });
  };

  const handleDateChange = (date: Date | null) => {
    console.log(date);
    setSelectedDate(date);
  };

  const handleInputChange = (

    event: React.ChangeEvent<{ id?: string; value: any }>

  ) => {

    const id = event.target.id as keyof typeof appointment;

    const { value } = event.target;

    setAppointment({ ...appointment, [id]: value });

  };
  const getNurse = async () => {
    let nid = localStorage.getItem("nid");
    fetch(`${apiUrl}/nurse/${nid}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        appointment.NurseID = res.data.ID
        if (res.data) {
          setNurses(res.data);
        } else {
          console.log("else");
        }
      });
  };

  const getDoctor = async () => {
    fetch(`${apiUrl}/doctors`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setDoctors(res.data);
        } else {
          console.log("else");
        }
      });
  };

  const getClinic = async () => {
    fetch(`${apiUrl}/clinics`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setClinics(res.data);
        } else {
          console.log("else");
        }
      });
  };

  const getPatient = async () => {
    fetch(`${apiUrl}/patients`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setPatients(res.data);
        } else {
          console.log("else");
        }
      });
  };

  useEffect(() => {
    getNurse();
    getDoctor();
    getClinic();
    getPatient();
  }, []);

  const convertType = (data: string | number | undefined) => {
    let val = typeof data === "string" ? parseInt(data) : data;
    return val;
  };

  function submit() {
    let data = {
      PatientID: convertType(appointment.PatientID),
      DoctorID: convertType(appointment.DoctorID),
      ClinicID: convertType(appointment.ClinicID),
      NurseID: convertType(appointment.NurseID),
      AppointmentTime: selectedDate,
      Note: appointment.Note ?? "",
    };

    console.log(data)

    const requestOptionsPost = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch(`${apiUrl}/appointments`, requestOptionsPost)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          console.log("บันทึกได้")
          setSuccess(true);
        } else {
          console.log("บันทึกไม่ได้")
          setError(true);
        }
      });
  }

  return (

    <Container className={classes.container} maxWidth="md" >
      <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          บันทึกข้อมูลสำเร็จ
        </Alert>
      </Snackbar>
      <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          บันทึกข้อมูลไม่สำเร็จ
        </Alert>
      </Snackbar>
      <Paper className={classes.paper}>
        <Box display="flex">
          <Box flexGrow={1}>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              บันทึกรายการนัดหมาย
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Grid container spacing={3} className={classes.root}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <p>หมายเลขบัตรประชาชน</p>
              <Select
                native
                value={appointment.PatientID}
                onChange={handleChange}
                inputProps={{
                  name: "PatientID",
                }}
              >
                <option aria-label="None" value="">
                  กรุณาเลือกหมายเลขบัตรประชาชน
                </option>
                {patients.map((item: PatientsInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.Id_card}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} >
            <p></p>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <p>แพทย์</p>
              <Select
                native
                value={appointment.DoctorID}
                onChange={handleChange}
                inputProps={{
                  name: "DoctorID",
                }}
              >
                <option aria-label="None" value="">
                  กรุณาเลือกแพทย์
                </option>
                {doctors.map((item: DoctorsInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.Name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <p>คลินิก</p>
              <Select
                native
                value={appointment.ClinicID}
                onChange={handleChange}
                inputProps={{
                  name: "ClinicID",
                }}
              >
                <option aria-label="None" value="">
                  กรุณาเลือกคลินิก
                </option>
                {clinics.map((item: ClinicsInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.Name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <p>วันที่และเวลานัดหมาย</p>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDateTimePicker
                  name="AppointmentTime"
                  value={selectedDate}
                  onChange={handleDateChange}
                  label="กรุณาเลือกวันที่และเวลา"
                  minDate={new Date("2018-01-01T00:00")}
                  format="yyyy/MM/dd hh:mm a"
                />
              </MuiPickersUtilsProvider>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <p>หมายเหตุ :</p>
              <TextField
                id="Note"
                variant="outlined"
                type="string"
                size="medium"
                value={appointment.Note || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <p>พยาบาล</p>
              <Select
                native
                value={appointment.NurseID}
                onChange={handleChange}
                disabled
                inputProps={{
                  name: "NurseID",
                }}
              >
              <option value={nurses?.ID} key={nurses?.ID}>
                  {nurses?.Firstname+" "+nurses?.Lastname}
                </option>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} >
            <p></p>
          </Grid>
          <Grid item xs={12}>
            <Button
              component={RouterLink}
              to="/appointments"
              variant="contained"
            >
              กลับ
            </Button>
            <Button
              style={{ float: "right" }}
              variant="contained"
              onClick={submit}
              color="primary"
            >
              บันทึก
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
export default AppointmentCreate;

