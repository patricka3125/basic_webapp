-- groups
select * from groups;

alter table groups AUTO_INCREMENT=1;

-- group_users
select * from group_users;

alter table group_users AUTO_INCREMENT=1;

delete from group_users where group_id = 1 and user_id = 1;