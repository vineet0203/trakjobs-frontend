import React from 'react';
import { Avatar, Box, List, ListItemButton, ListItemText, Paper, Typography } from '@mui/material';

const CrewList = ({ crewMembers, selectedCrewId, onSelect }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid #3f79c7',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Typography sx={{ px: 2, py: 1.25, fontSize: 24, fontWeight: 700, color: '#3b3b3b' }}>
        Crew Member
      </Typography>

      <List sx={{ p: 0 }}>
        {crewMembers.map((member) => {
          const selected = member.id === selectedCrewId;

          return (
            <ListItemButton
              key={member.id}
              onClick={() => onSelect(member.id)}
              sx={{
                px: 1.5,
                py: 1,
                borderTop: '1px solid #e7e7e7',
                backgroundColor: selected ? '#3b76bc' : '#fff',
                '&:hover': {
                  backgroundColor: selected ? '#3b76bc' : '#f7fbff',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                <Avatar src={member.avatar} sx={{ width: 36, height: 36 }}>
                  {member.name.charAt(0)}
                </Avatar>
                <ListItemText
                  primary={member.name}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: selected ? '#ffffff' : '#343443',
                  }}
                />
              </Box>
            </ListItemButton>
          );
        })}
      </List>
    </Paper>
  );
};

export default CrewList;