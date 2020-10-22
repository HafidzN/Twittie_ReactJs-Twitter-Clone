import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Slider from '@material-ui/core/Slider'
import RemoveCircleOutlineOutlinedIcon from '@material-ui/icons/RemoveCircleOutlineOutlined';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined'

const useStyles = makeStyles({
  root: {
    minWidth: 100,
  },
})

export default function ContinuousSlider({val, setVal}) {
  const classes = useStyles()

  const handleChange = (event, newValue) => {
    setVal(newValue)
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item>
          <RemoveCircleOutlineOutlinedIcon />
        </Grid>
        <Grid item xs>
          <Slider value={val} 
          onChange={handleChange} 
          min={1}
          max={100}
          aria-labelledby="continuous-slider" />
        </Grid>
        <Grid item>
          <AddCircleOutlineOutlinedIcon />
        </Grid>
      </Grid>
    </div>
  )
}