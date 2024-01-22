import React from "react";

import { SideBlock } from "./SideBlock";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";
import { useSelector } from "react-redux";

export const CommentsBlock = ({ items, user, children }) => { 
  

  return (
    <SideBlock title="Комментарии">
    <List>
        {items?.map((obj, index) => (
          <React.Fragment key={index}>
            <ListItem style={{display: "block"}}  alignItems="center">
           
              <ListItemAvatar style={{display: 'flex', alignItems: "center"}}>
                
                <Avatar src={user.avatarUrl}/>
                <p style={{marginLeft: '15px'}}>{obj.user}</p>
                
        
                
              
              </ListItemAvatar>

                <ListItemText style={{marginLeft: '60px'}}
                  primary={null}
                  secondary={obj.comment}
                />
            
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
      {children}
    </SideBlock>
  );
};
