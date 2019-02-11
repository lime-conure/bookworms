import React, {Component} from 'react'
import {Link} from 'react-router-dom'

//Material UI
import {withStyles} from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Icon from '@material-ui/core/Icon'
import Button from '@material-ui/core/Button'

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing.unit * 4,
    marginTop: theme.spacing.unit * 16,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '95%',
    // md = 960px or larger
    [theme.breakpoints.up('md')]: {
      width: '70%',
      padding: theme.spacing.unit * 8
    },
    color: '#fff'
  },
  userInfo: {
    textAlign: 'center'
  },
  bigAvatar: {
    width: '100%',
    height: '100%',
    maxWidth: 200,
    maxHeight: 200,
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 4,
    marginRight: 'auto',
    marginLeft: 'auto'
  },
  link: {
    color: '#fff',
    '&:hover': {
      color: '#C6FF00'
    }
  },
  about: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 6,
    fontSize: '1.25rem',
    lineHeight: '1.875rem'
  },
  team: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 6
  }
})

class AboutUs extends Component {
  render() {
    const {classes} = this.props
    return (
      <Paper className={classes.root} elevation={2}>
        <Typography variant="h4" component="h4" gutterBottom>
          Manage Your Book Clubs
        </Typography>
        <Divider />
        <div className={classes.about}>
          <Typography
            variant="body1"
            component="p"
            gutterBottom
            style={{
              fontSize: '1.25rem',
              lineHeight: '1.875rem',
              marginBottom: '20px'
            }}
          >
            Bookworms is an app for readers to create, manage, and communicate
            with their book clubs. We consolidate everything related to your
            book clubs in one place, and provide simple, easy-to-use tools for
            organizing your reading life. With Bookworms, you can keep track of
            books you've read and want to read, visualize your reading history
            and progress, schedule meetings for book clubs you're in, chat with
            other book club members, and create polls for your book clubs to
            decide on what to read next, when to meet, and where to meet.
          </Typography>
          <Button
            variant="contained"
            href="https://github.com/lime-conure/bookworms"
            color="primary"
            size="large"
          >
            Github repo
          </Button>
        </div>

        <Typography variant="h4" component="h4" gutterBottom>
          Our Team
        </Typography>
        <Divider />

        <Grid
          container
          spacing={32}
          justify="space-between"
          alignItems="flex-start"
          className={classes.team}
        >
          <Grid item md={3} className={classes.userInfo}>
            <Avatar
              alt="Brynn Shepherd"
              src="Brynn_Shepherd.jpg"
              className={classes.bigAvatar}
            />
            <Typography variant="h6" component="h6">
              <a
                href="http://github.com/brynn"
                rel="noopener noreferrer"
                target="_blank"
                className={classes.link}
              >
                Brynn Shepherd
              </a>
            </Typography>
            <Typography variant="subtitle1" component="p">
              brynn.shepherd@gmail.com
            </Typography>
          </Grid>

          <Grid item md={3} className={classes.userInfo}>
            <Avatar
              alt="Sabira Davletshina"
              src="Sabira_Davletshina.jpg"
              className={classes.bigAvatar}
            />
            <Typography variant="h6" component="h6">
              <a
                href="http://github.com/Sdavletshina"
                rel="noopener noreferrer"
                target="_blank"
                className={classes.link}
              >
                Sabira Davletshina
              </a>
            </Typography>
            <Typography variant="subtitle1" component="p">
              sabira.davletshina@gmail.com
            </Typography>
          </Grid>

          <Grid item md={3} className={classes.userInfo}>
            <Avatar
              alt="Jing Lu"
              src="Jing_Lu.jpg"
              className={classes.bigAvatar}
            />
            <Typography variant="h6" component="h6">
              <a
                href="http://github.com/Jl201835"
                rel="noopener noreferrer"
                target="_blank"
                className={classes.link}
              >
                Jing Lu
              </a>
            </Typography>
            <Typography variant="subtitle1" component="p">
              jl201835@gmail.com
            </Typography>
          </Grid>

          <Grid item md={3} className={classes.userInfo}>
            <Avatar
              alt="Norka Avalos"
              src="Norka_Avalos.jpg"
              className={classes.bigAvatar}
            />
            <Typography variant="h6" component="h6">
              <a
                href="http://github.com/norkavalos"
                rel="noopener noreferrer"
                target="_blank"
                className={classes.link}
              >
                Norka Avalos
              </a>
            </Typography>
            <Typography variant="subtitle1" component="p">
              norkaavalos11@gmail.com
            </Typography>
          </Grid>
        </Grid>
        <Typography variant="h4" component="h4" gutterBottom>
          Technologies Used
        </Typography>
        <Divider />
        <Typography
          variant="body1"
          component="p"
          className={classes.about}
          style={{marginBottom: '10px'}}
        >
          Bookworms runs on Heroku using Node.js, PostgreSQL/Sequelize,
          Express.js, React, and Redux. We also integrated the following
          libraries and APIs:
        </Typography>
        <List>
          <ListItem className={classes.link}>
            <ListItemIcon>
              <Icon>collections_bookmarks</Icon>
            </ListItemIcon>
            <ListItemText>
              <a
                rel="noopener noreferrer"
                target="_blank"
                href="https://www.goodreads.com/api"
              >
                <Typography variant="body1" className={classes.link}>
                  Goodreads API
                </Typography>
              </a>
            </ListItemText>
          </ListItem>
          <ListItem className={classes.link}>
            <ListItemIcon>
              <Icon>timeline</Icon>
            </ListItemIcon>
            <ListItemText>
              <a
                rel="noopener noreferrer"
                target="_blank"
                href="http://recharts.org"
              >
                <Typography variant="body1" className={classes.link}>
                  Recharts
                </Typography>
              </a>
            </ListItemText>
          </ListItem>
          <ListItem className={classes.link}>
            <ListItemIcon>
              <Icon>notification_important</Icon>
            </ListItemIcon>
            <ListItemText>
              <a
                rel="noopener noreferrer"
                target="_blank"
                href="https://pushjs.org"
              >
                <Typography variant="body1" className={classes.link}>
                  Push.js
                </Typography>
              </a>
            </ListItemText>
          </ListItem>
          <ListItem className={classes.link}>
            <ListItemIcon>
              <Icon>chat</Icon>
            </ListItemIcon>
            <ListItemText>
              <a
                rel="noopener noreferrer"
                target="_blank"
                href="https://socket.io/"
              >
                <Typography variant="body1" className={classes.link}>
                  Socket.io
                </Typography>
              </a>
            </ListItemText>
          </ListItem>
          <ListItem className={classes.link}>
            <ListItemIcon>
              <Icon>dashboard</Icon>
            </ListItemIcon>
            <ListItemText>
              <a
                rel="noopener noreferrer"
                target="_blank"
                href="https://material-ui.com"
              >
                <Typography variant="body1" className={classes.link}>
                  Material UI
                </Typography>
              </a>
            </ListItemText>
          </ListItem>
        </List>
      </Paper>
    )
  }
}

const StyledAboutUs = withStyles(styles)(AboutUs)
export default StyledAboutUs
