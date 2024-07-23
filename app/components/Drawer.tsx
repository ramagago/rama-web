import { Global } from '@emotion/react'
import { styled } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { grey } from '@mui/material/colors'
import Typography from '@mui/material/Typography'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import { useState } from 'react'
import Contact from '../sections/Contact'
import { FaAngleUp } from 'react-icons/fa6'

const drawerBleeding = 56

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window
}

const Root = styled('div')(({ theme }) => ({
  height: '100%',
  backgroundColor:
    theme.palette.mode === 'light'
      ? grey[100]
      : theme.palette.background.default,
}))

const StyledBox = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? '#fff' : grey[800],
}))

const Puller = styled('div')(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
  borderRadius: 3,
  position: 'absolute',
  top: drawerBleeding + 10,
  left: 'calc(50% - 15px)',
  zIndex: 1301,
}))

export default function SwipeableEdgeDrawer(props: Props) {
  const { window } = props
  const [open, setOpen] = useState(false)

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen)
  }

  // This is used only for the example
  const container =
    window !== undefined ? () => window().document.body : undefined

  return (
    <Root>
      <CssBaseline />
      <Global
        styles={{
          '.MuiDrawer-root > .MuiPaper-root': {
            height: `auto`,
            overflow: 'visible',
          },
        }}
      />
      <button
        onClick={toggleDrawer(!open)}
        className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[1301] transition-transform duration-300 ${
          open ? 'translate-y-0' : 'translate-y-0'
        }`}
      >
        <FaAngleUp
          className={`text-gray-500 text-5xl bg-white rounded-full p-2 opacity-100 transition-transform duration-300 hover:opacity-90 hover:text-gray-300 ${
            !open ? 'rotate-0' : 'rotate-180'
          } `}
        />
      </button>

      <SwipeableDrawer
        container={container}
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <StyledBox
          sx={{
            position: 'absolute',
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: 'visible',
            right: 0,
            left: 0,
            width: '100vw',
          }}
        >
          {open ? <Puller /> : null}
          {!open ? (
            <Typography sx={{ p: 2, color: 'text.secondary' }}>
              Contact
            </Typography>
          ) : null}
        </StyledBox>
        <StyledBox
          sx={{
            px: 2,
            pb: 2,
            height: '100%',
            overflow: 'auto',
          }}
        >
          <Contact />
        </StyledBox>
      </SwipeableDrawer>
    </Root>
  )
}
