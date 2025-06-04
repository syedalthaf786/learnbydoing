import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider
} from '@mui/material';
import {
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  YouTube
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const footerLinks = {
  learn: [
    { title: 'Courses', path: '/courses' },
    { title: 'Progress', path: '/progress' },
    { title: 'Discussion', path: '/discussion' },
    { title: 'FAQ', path: '/faq' }
  ],
  about: [
    { title: 'About Us', path: '/about' },
    { title: 'Contact', path: '/contact' },
    { title: 'Terms', path: '/terms' },
    { title: 'Privacy', path: '/privacy' }
  ],
  social: [
    { icon: <Facebook />, link: 'https://facebook.com' },
    { icon: <Twitter />, link: 'https://twitter.com' },
    { icon: <LinkedIn />, link: 'https://linkedin.com' },
    { icon: <Instagram />, link: 'https://instagram.com' },
    { icon: <YouTube />, link: 'https://youtube.com' }
  ]
};

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[900]
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Learn By Doing
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Empowering learners through practical education and hands-on experience.
              Join our community and start your learning journey today.
            </Typography>
            <Box sx={{ mt: 2 }}>
              {footerLinks.social.map((social, index) => (
                <IconButton
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="primary"
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Learn Links */}
          <Grid item xs={6} md={2}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Learn
            </Typography>
            <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
              {footerLinks.learn.map((link, index) => (
                <Box component="li" key={index} sx={{ pb: 1 }}>
                  <Link
                    component={RouterLink}
                    to={link.path}
                    color="text.secondary"
                    sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
                  >
                    {link.title}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* About Links */}
          <Grid item xs={6} md={2}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              About
            </Typography>
            <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
              {footerLinks.about.map((link, index) => (
                <Box component="li" key={index} sx={{ pb: 1 }}>
                  <Link
                    component={RouterLink}
                    to={link.path}
                    color="text.secondary"
                    sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
                  >
                    {link.title}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: support@learnbydoing.com
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Phone: +91 1234567890
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Address:Hyderabad, Telangana
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ mt: 6, mb: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary">
            © {currentYear} Learn By Doing. All rights reserved.
          </Typography>
          <Box>
            <Link
              component={RouterLink}
              to="/terms"
              color="text.secondary"
              sx={{ mr: 2, textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
            >
              Terms
            </Link>
            <Link
              component={RouterLink}
              to="/privacy"
              color="text.secondary"
              sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
            >
              Privacy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;