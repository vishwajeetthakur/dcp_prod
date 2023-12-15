// Packages
import React, { useEffect } from 'react';
import {
  Box, Button, Card, CardActions, CardActionArea, CardContent, Chip, Container,
  Grid, Link, List, ListItem, ListItemText, Paper,
  Table, TableBody, TableCell, TableContainer, TableRow,
  Typography, Tab, Tabs, CircularProgress,
} from '@mui/material';

// Components

// Hooks

// Utils

// Types

// Styles
import './ComplianceAndDesign.scss';

function ComplianceAndDesign() {
  // ==============================================
  // Hooks
  // ==============================================

  // =============================================
  // State/Refs
  // =============================================

  // =============================================
  // Helpers (Memo, CB, vars)
  // =============================================

  // =============================================
  // Interaction Handlers
  // =============================================

  // =============================================
  // Render Methods
  // =============================================

  // =============================================
  // Effects
  // =============================================

  // =============================================
  // Return
  // =============================================
  return (
    <Container className="compliance-and-design">
      <Grid container spacing={4}>
        {[
          'EBU', 'IPSwip', 'Voice Gateway Picker',
          'Remedy Ticket Generator', 'Sense Isin', 'Odin',
        ].map((tool) => (
          <Grid key={tool} item md={4}>
            <Card sx={{ p: 6 }}>
              {tool}
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default ComplianceAndDesign;