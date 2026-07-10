-- Books table
create table books (
    id serial primary key,

    title varchar(255) not null,
    author varchar(255) not null,

    isbn varchar(20),

    cover_url text,

    rating integer check(rating between 1 and 10),

    review text,

    status varchar(30) default 'want to read',

    pages integer default 0,

    current_page integer default 0,

    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp

);

--Tags table
create table tags(
    id serial primary key,
    name varchar(50) unique not null
);


--Many to many relationship
create table book_tags(
    book_id integer references books(id) on delete cascade,
    tags_id integer refrences tags(id) on delete cascade,

    primary_key(book_id,tags_id)
);