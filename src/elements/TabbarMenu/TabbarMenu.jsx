import './TabbarMenu.css'
import React from 'react'
import PropTypes from 'prop-types'
import SwipeableViews from 'react-swipeable-views'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import {AppBar, Tabs, Tab, Typography, Box} from '@material-ui/core'


function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component={"span"}>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  }
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper
  },
}))

export default function FullWidthTabs({items}) {
  const classes = useStyles()
  const theme = useTheme()
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleChangeIndex = (index) => {
    setValue(index)
  }

  return (
    <div className={`tabbarMenu ${classes.root}` }>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="crop and edit image"
        >
          {/* <Tab icon={<CropIcon />} {...a11yProps(0)} />
          <Tab label="ALT" {...a11yProps(1)} /> */}
          {
            items.map(item => {
              return <Tab key   = {item.id}
                          icon  = {item.icon}
                          label = {item.title}
                          {...a11yProps(item.id)}
              />
            })
          }
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        {/* <TabPanel value={value} index={0} dir={theme.direction}>
          {items.item}
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          Item Two
        </TabPanel> */}

        {
          items.map(item => {
            return  <TabPanel value={value} index={item.id} dir={theme.direction} key={item.id}>
                      {item["item"]}
                    </TabPanel>
          })
        }
      </SwipeableViews>
    </div>
  )
}