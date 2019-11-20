import React  from 'react'
import Map from '../../data-viz/Map'
import { makeStyles } from '@material-ui/core/styles'

const MapSection = (props) => {

const styles=useStyles();
    return (
	<section className={styles.root}>
	  <div className={styles.containerBottom}>
	    <Map key=1 props={props}
		 />
	  </div>
	</section>
    )
}

export default MapSection



const useStyles = makeStyles(theme => (
    {
	containerBottom: {
	    minWidth:'280px',
	    flexBasis:'100%',		    
	    height: '600px',
	    order:'3'
	    
    }
    }))


