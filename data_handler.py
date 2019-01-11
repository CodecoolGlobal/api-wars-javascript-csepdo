import database_common


@database_common.connection_handler
def save_user(cursor, user_data, hashed_password):
    cursor.execute("""INSERT INTO "user" (username, password)
                    VALUES (%(user_name)s, %(hashed_password)s);""",
                   {'user_name': user_data['user_name'],
                    'hashed_password': hashed_password})


@database_common.connection_handler
def get_user_by_name(cursor, username):
    cursor.execute("""SELECT * FROM "user"
                      WHERE username=%(username)s""",
                   {'username': username})
    user_data = cursor.fetchone()
    return user_data


@database_common.connection_handler
def list_all_users(cursor):
    cursor.execute("""SELECT DISTINCT "user".user_name, "user".user_email, "user".reg_time, "user".user_image,
                    (SELECT COUNT(question.id) FROM question WHERE question.username="user".user_name) as question,
                    (SELECT COUNT(answer.id) FROM answer WHERE answer.username="user".user_name) as answer,
                    (SELECT COUNT("comment".id) FROM "comment" WHERE "comment".username="user".user_name) as "comment"
                    FROM "user"
                    LEFT JOIN question ON "user".user_name=question.username
                    LEFT JOIN answer ON "user".user_name=answer.username
                    LEFT JOIN "comment" ON "user".user_name="comment".username
                    WHERE "user".user_name=question.username AND "user".user_name=answer.username AND "user".user_name="comment".username
                    OR (question.username IS NULL) OR (answer.username IS NULL) OR ("comment".username IS NULL)
                    GROUP BY "user".user_name, question.id, answer.id, "comment".id""")
    return cursor.fetchall()
