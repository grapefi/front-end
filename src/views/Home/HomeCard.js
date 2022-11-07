import React from 'react';
import cx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {Stack} from '@mui/material';
import Button from '@material-ui/core/Button';
import {Row, Item} from '@mui-treasury/components/flex';
import {Paper} from '@material-ui/core';
import {Link} from 'react-router-dom';
import ribbonImg from '../../assets/img/new-ribbon.png';

import soleraImg from '../../assets/img/solera.png';
import xGrapeImg from '../../assets/img/xGrape.png';
import grapeWineImg from '../../assets/img/grape-wine.png';
import gnodeImg from '../../assets/img/gnode.png';
import barrelImg from '../../assets/img/barrel.png';
import WinemakerImg from '../../assets/img/Winemaker.png';
import rebatesImg from '../../assets/img/rebates.png';
import casinocoinsImg from '../../assets/img/casinocoins.png';
import burninggrapeImg from '../../assets/img/burninggrape.png';
import gobletImg from '../../assets/img/goblet.png';

const imageMap = {
  solera: soleraImg,
  xGrape: xGrapeImg,
  grapeWine: grapeWineImg,
  gnode: gnodeImg,
  barrel: barrelImg,
  Winemaker: WinemakerImg,
  rebates: rebatesImg,
  casinocoins: casinocoinsImg,
  burninggrape: burninggrapeImg,
  goblet: gobletImg,
};
const useStyles = makeStyles(({palette}) => ({
  root: ({color}) => ({
    borderRadius: '5px !important',
    border: 'solid',
    borderWidth: '3px',
    borderColor: '#000',
    // background: `rgba(0, 0, 0, 0.5) !important;`,
    background: `linear-gradient(to bottom, #1a1a1a, #333333)`,
  }),

  content: ({color}) => ({
    zIndex: 1,
    bottom: 0,
  }),
  title: {
    transition: '0.3s',
    fontSize: '1.6rem !important',
    margin: 0,
    color: '#e647e6',
  },

  subtitle: {
    fontSize: '1.1rem !important',
    margin: 0,
    padding: 0,
    color: '#fff',
  },
  description: {
    fontSize: '1rem !important',
    color: '#e3e3e3 !important',
    margin: 0,
  },
  logo: {
    marginTop: '20px',
    transition: '0.3s',
    height: 110,
    objectFit: 'contain !important',
  },
  contentText: {
    fontSize: '0.8rem !important',
    color: '#fff',
  },
}));

const CustomCard = ({item, styles, title, subTitle, subItems}) => {
  return (
    <Stack direction="column" className={cx(styles.root, styles.color)} justifyContent="space-between" spacing={0}>
      {item.isNew && <img alt="New" className="new-ribbon" src={ribbonImg}></img>}

      <Row p={2} style={{marginTop: item.isNew ? '-55px' : null}}>
        <Grid container justifyContent="space-between" style={{textAlign: 'center'}}>
          <Grid item xs={12}>
            <h1 className={styles.title} style={{color: item.color}}>
              {title}
            </h1>
            <h3 className={styles.subtitle}>{subTitle}</h3>
          </Grid>
          <Grid item xs={12}>
            <img alt={item.image} className={styles.logo} src={imageMap[item.image]} />
          </Grid>
        </Grid>
      </Row>

      <div
        style={{
          borderBottomLeftRadius: '5px',
          borderBottomRightRadius: '5px',
          backgroundColor: 'rgba(200,200,200, 0.1)',
        }}
      >
        <Row px={2} pt={2}>
          <Item>
            <div className={styles.contentText}>{item.description}</div>
          </Item>
        </Row>

        <Grid container style={{padding: '15px'}} justifyContent="space-evenly" spacing={2}>
          {subItems == null && (
            <Grid item style={{width: '100%'}}>
              {item.isInternalLink === true ? (
                <Link to={item.linkTo} style={{textDecoration: 'none'}}>
                  <Button className="shinyButton full-width">Go to {item.label}</Button>
                </Link>
              ) : (
                <a
                  style={{textDecoration: 'none'}}
                  target={item.isInternalLink === false ? '_blank' : ''}
                  href={item.linkTo}
                >
                  <Button className="shinyButton full-width" target="_blank" href={item.linkTo}>
                    Go to {item.label}
                  </Button>
                </a>
              )}
            </Grid>
          )}

          {subItems != null && subItems.length > 0
            ? subItems.map((subItem) => (
                <Grid item xs={subItems.length === 1 ? 12 : subItems.length % 2 ? 4 : 6}>
                  {subItem.isInternalLink === true ? (
                    <Link to={subItem.linkTo} style={{textDecoration: 'none'}}>
                      <Button className="shinyButton full-width">{subItem.label}</Button>{' '}
                    </Link>
                  ) : (
                    <a
                      style={{textDecoration: 'none'}}
                      target={subItem.isInternalLink === false ? '_blank' : ''}
                      href={subItem.linkTo}
                    >
                      <Button className="shinyButton full-width">{subItem.label}</Button>
                    </a>
                  )}
                </Grid>
              ))
            : null}
        </Grid>
      </div>
    </Stack>
  );
};

export const HomeCard = ({item}) => {
  const styles1 = useStyles({color: item.color});
  return (
    <Grid key={item.label} item xs={12} sm={12} md={6} lg={4}>
      <CustomCard
        key={item.label}
        item={item}
        styles={styles1}
        subItems={item.items}
        title={item.label}
        subTitle={item.subLabel}
      />
    </Grid>
  );
};

export default HomeCard;
