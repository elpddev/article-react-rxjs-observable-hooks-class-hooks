import { Button, Grid } from "@mui/material";
import React from "react";

export class BasicPad extends React.Component {
  render() {
    return (
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Button variant="outlined">1</Button>
        </Grid>
        <Grid item xs={4}>
          <Item>xs=4</Item>
        </Grid>
        <Grid item xs={4}>
          <Item>xs=4</Item>
        </Grid>
        <Grid item xs={8}>
          <Item>xs=8</Item>
        </Grid>
      </Grid>
    );
  }
}
