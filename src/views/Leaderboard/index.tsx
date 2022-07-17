import React from 'react';
import { Theme } from '@mui/material/styles';
import withStyles from '@mui/styles/withStyles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Page from '../../components/Page';
import {useGetEventQuery} from '../../services/event';
import {convertTime} from '../../utils/convertTime';
import { createGlobalStyle } from 'styled-components';

const BackgroundImage = createGlobalStyle`
  body {
    background-size: cover !important;
    background: linear-gradient(90deg, rgba(144,17,105,1) 0%, rgba(95,17,144,1) 100%);
    ;
  }
`;

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: 'transparent',
      color: '#fff',
      fontSize: 20,
      fontWeight: 500,
    },
    body: {
      fontSize: 20,
      color: '#fff',
    },
  }),
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: 'rgba(0,0,0,0.5)',
      },
    },
  }),
)(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

const LeaderBoard = () => {
  const classes = useStyles();

  const {data: eventResponse} = useGetEventQuery();
  
  const [leaderBoardEntire, setLeaderBoardEntire] = React.useState([]);
  const [leaderBoardLastWeek, setLeaderBoardLastWeek] = React.useState([]);
  React.useEffect(() => {
    if (eventResponse && eventResponse.result) {
      setLeaderBoardEntire(eventResponse.data.leaderBoard);
      setLeaderBoardLastWeek(eventResponse.data.leaderBoardLastWeek);
    }
  }, [eventResponse]);

  return (
    <Page>
      <BackgroundImage />
      <h1 style={{fontSize: '65px', textAlign: 'center', marginBottom: '15px'}}>Node LeaderBoard</h1>
      <h1 style={{fontSize: '45px', textAlign: 'left', marginBottom: '15px'}}>All Time</h1>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Rank</StyledTableCell>
              <StyledTableCell>User</StyledTableCell>
              <StyledTableCell>Last Node Time</StyledTableCell>
              <StyledTableCell>Node Count</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderBoardEntire.map((row, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell component="th" scope="row">
                  {index + 1}
                </StyledTableCell>
                <StyledTableCell>{(row._id).substring(35)}</StyledTableCell>
                <StyledTableCell>{convertTime(row.timestamp)}</StyledTableCell>
                <StyledTableCell>{row.num}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <h1 style={{fontSize: '45px', textAlign: 'left', marginTop: '15px', marginBottom: '15px'}}>Last Week</h1>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Rank</StyledTableCell>
              <StyledTableCell>User</StyledTableCell>
              <StyledTableCell>Last Node Time</StyledTableCell>
              <StyledTableCell>Node Count</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderBoardLastWeek.map((row, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell component="th" scope="row">
                  {index + 1}
                </StyledTableCell>
                <StyledTableCell>{(row._id).substring(35)}</StyledTableCell>
                <StyledTableCell>{convertTime(row.timestamp)}</StyledTableCell>
                <StyledTableCell>{row.num}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Page>
  );
};

export default LeaderBoard;