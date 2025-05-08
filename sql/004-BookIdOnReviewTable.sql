ALTER TABLE review
	ADD book_id bigint;
ALTER TABLE Review
	ADD CONSTRAINT FK_Review_Book foreign key (book_id) references Book (book_id);