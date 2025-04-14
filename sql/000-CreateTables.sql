CREATE TABLE app_user (
                          app_user_id bigint GENERATED ALWAYS AS IDENTITY,
                          name varchar(50) NOT NULL,
                          email varchar(100) NOT NULL,
                          password varchar(100) NOT NULL,
                          created_at timestamp NOT NULL,
                          updated_at timestamp NOT NULL,

                          CONSTRAINT PK_app_user PRIMARY KEY (app_user_id)
);

CREATE TABLE Book (
                      book_id bigint GENERATED ALWAYS AS IDENTITY,
                      title varchar(200) NOT NULL,
                      genres text[] NOT NULL,
                      release_date date NOT NULL,
                      isbn_10 varchar(10) UNIQUE NOT NULL,
                      isbn_13 varchar(13) UNIQUE NOT NULL,
                      editor varchar NOT NULL,
                      edition_language varchar NOT NULL,
                      description varchar,
                      pages integer,
                      created_at timestamp NOT NULL,
                      updated_at timestamp NOT NULL,

                      CONSTRAINT PK_book PRIMARY KEY (book_id)
);

CREATE TYPE shelf_type AS ENUM ('TO_READ', 'READING', 'READ', 'USER');

CREATE TABLE Shelf (
                       shelf_id bigint GENERATED ALWAYS AS IDENTITY,
                       name varchar(100) NOT NULL,
                       shelf_type shelf_type NOT NULL,
                       created_at timestamp NOT NULL,
                       updated_at timestamp NOT NULL,
                       app_user_id bigint NOT NULL,

                       CONSTRAINT PK_shelf PRIMARY KEY (shelf_id),
                       CONSTRAINT FK_Shelf_app_user foreign key (app_user_id) references app_user (app_user_id)
);

CREATE TABLE Shelf_Book (
                            shelf_book_id bigint GENERATED ALWAYS AS IDENTITY,
                            shelf_id bigint NOT NULL,
                            book_id bigint NOT NULL,

                            CONSTRAINT PK_shelfbook PRIMARY KEY (shelf_book_id),
                            CONSTRAINT FK_ShelfBook_Shelf foreign key (shelf_id) references Shelf (shelf_id),
                            CONSTRAINT FK_ShelfBook_Book foreign key (book_id) references Book (book_id)
);

CREATE TABLE Review (
                        review_id bigint GENERATED ALWAYS AS IDENTITY,
                        score int NOT NULL CHECK (score BETWEEN 1 AND 5),
                        app_user_id bigint NOT NULL,
                        commentary varchar(5000),
                        created_at timestamp NOT NULL,
                        updated_at timestamp NOT NULL,

                        CONSTRAINT PK_review PRIMARY KEY (review_id),
                        CONSTRAINT FK_Review_app_user foreign key (app_user_id) references app_user (app_user_id)
);

CREATE TYPE history_status AS ENUM ('TO_READ', 'READING', 'READ');
CREATE TABLE History (
                         history_id bigint GENERATED ALWAYS AS IDENTITY,
                         app_user_id bigint NOT NULL,
                         book_id bigint NOT NULL,
                         old_status history_status,
                         new_status history_status NOT NULL,
                         created_at timestamp NOT NULL,

                         CONSTRAINT PK_history PRIMARY KEY (history_id),
                         CONSTRAINT FK_History_app_user foreign key (app_user_id) references app_user (app_user_id),
                         CONSTRAINT FK_History_Book foreign key (book_id) references Book (book_id)
);

CREATE TABLE Author (
                        author_id bigint GENERATED ALWAYS AS IDENTITY,
                        name varchar(100) NOT NULL,
                        slug varchar(100) UNIQUE NOT NULL,
                        created_at timestamp NOT NULL,
                        updated_at timestamp NOT NULL,

                        CONSTRAINT PK_author PRIMARY KEY (author_id)
);

CREATE TABLE Book_Author (
                             book_author_id bigint GENERATED ALWAYS AS IDENTITY,
                             author_id bigint NOT NULL,
                             book_id bigint NOT NULL,

                             CONSTRAINT PK_bookauthor PRIMARY KEY (book_author_id),
                             CONSTRAINT FK_BookAuthor_Author foreign key (author_id) references Author (author_id),
                             CONSTRAINT FK_BookAuthor_Book foreign key (book_id) references Book (book_id)
);

CREATE TYPE search_type AS ENUM ('BOOK_TITLE', 'BOOK_AUTHOR', 'AUTHOR');
CREATE TABLE Search (
                        search_id bigint GENERATED ALWAYS AS IDENTITY,
                        author_id bigint,
                        book_id bigint,
                        search_type search_type NOT NULL,
                        created_at timestamp NOT NULL,
                        updated_at timestamp NOT NULL,

                        CONSTRAINT PK_search PRIMARY KEY (search_id),
                        CONSTRAINT FK_Search_Author foreign key (author_id) references Author (author_id),
                        CONSTRAINT FK_Search_Book foreign key (book_id) references Book (book_id)
);