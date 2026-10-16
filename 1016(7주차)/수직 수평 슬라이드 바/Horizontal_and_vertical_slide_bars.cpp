
#include <stdio.h>
#include <conio.h>
#include <windows.h>

HANDLE hConsole;

void gotoxy(int x, int y);
void put_char(int x, int y, wchar_t ch);
void draw_rectangle(int x, int y, int width, int height);
void draw_horizontal_slide(int value, int y, int length);
void draw_vertical_slide(int x, int value, int length);
void move_arrow_key(int key, int *x, int *y, int x_max, int y_max);
void clear_screen(void);
void draw_screen(int x, int y, int h_len, int v_len);

int main(void)
{
    int x = 1, y = 1;
    int h_slide_length, v_slide_length;
    int key;

    hConsole = GetStdHandle(STD_OUTPUT_HANDLE);

    printf("Horizontal slide length (1~70): ");
    if (scanf("%d", &h_slide_length) != 1)
        return 1;

    printf("Vertical slide length (1~19): ");
    if (scanf("%d", &v_slide_length) != 1)
        return 1;

    if (h_slide_length < 1 || h_slide_length > 70 ||
        v_slide_length < 1 || v_slide_length > 19)
    {
        printf("Invalid length.\n");
        return 1;
    }

    CONSOLE_CURSOR_INFO cursorInfo;
    GetConsoleCursorInfo(hConsole, &cursorInfo);
    cursorInfo.bVisible = FALSE;
    SetConsoleCursorInfo(hConsole, &cursorInfo);

    draw_screen(x, y, h_slide_length, v_slide_length);

    while (1)
    {
        key = _getch();

        if (key == 27)
            break;

        if (key == 0 || key == 224)
        {
            key = _getch();

            move_arrow_key(
                key, &x, &y,
                h_slide_length, v_slide_length
            );

            draw_screen(
                x, y,
                h_slide_length, v_slide_length
            );
        }
    }

    cursorInfo.bVisible = TRUE;
    SetConsoleCursorInfo(hConsole, &cursorInfo);

    clear_screen();
    gotoxy(0, 0);

    return 0;
}

void gotoxy(int x, int y)
{
    COORD pos;

    pos.X = (SHORT)x;
    pos.Y = (SHORT)y;

    SetConsoleCursorPosition(hConsole, pos);
}

void put_char(int x, int y, wchar_t ch)
{
    DWORD written;

    gotoxy(x, y);
    WriteConsoleW(hConsole, &ch, 1, &written, NULL);
}

void draw_rectangle(int x, int y, int width, int height)
{
    int i;

    put_char(x, y, L'\u250C');

    for (i = 1; i < width - 1; i++)
        put_char(x + i, y, L'\u2500');

    put_char(x + width - 1, y, L'\u2510');

    for (i = 1; i < height - 1; i++)
    {
        put_char(x, y + i, L'\u2502');
        put_char(x + width - 1, y + i, L'\u2502');
    }

    put_char(x, y + height - 1, L'\u2514');

    for (i = 1; i < width - 1; i++)
        put_char(x + i, y + height - 1, L'\u2500');

    put_char(x + width - 1, y + height - 1, L'\u2518');
}

void draw_horizontal_slide(int value, int y, int length)
{
    int start_x = 2;
    int width = length + 3;

    draw_rectangle(start_x, y, width, 3);

    put_char(start_x + value, y + 1, L'\u2588');
    put_char(start_x + value + 1, y + 1, L'\u2588');

    gotoxy(start_x + width + 2, y);
    printf("%2d", value);
    fflush(stdout);
}

void draw_vertical_slide(int x, int value, int length)
{
    int start_y = 0;

    draw_rectangle(x, start_y, 4, length + 2);

    put_char(x + 1, start_y + value, L'\u2588');
    put_char(x + 2, start_y + value, L'\u2588');

    gotoxy(x + 7, start_y + length);
    printf("%2d", value);
    fflush(stdout);
}

void move_arrow_key(int key, int *x, int *y,
                    int x_max, int y_max)
{
    switch (key)
    {
        case 72:
            (*y)--;
            if (*y < 1)
                *y = 1;
            break;

        case 80:
            (*y)++;
            if (*y > y_max)
                *y = y_max;
            break;

        case 75:
            (*x)--;
            if (*x < 1)
                *x = 1;
            break;

        case 77:
            (*x)++;
            if (*x > x_max)
                *x = x_max;
            break;
    }
}

void clear_screen(void)
{
    CONSOLE_SCREEN_BUFFER_INFO csbi;
    DWORD written;
    DWORD size;
    COORD origin = {0, 0};

    GetConsoleScreenBufferInfo(hConsole, &csbi);

    size = csbi.dwSize.X * csbi.dwSize.Y;

    FillConsoleOutputCharacterW(
        hConsole, L' ', size, origin, &written
    );

    FillConsoleOutputAttribute(
        hConsole, csbi.wAttributes,
        size, origin, &written
    );

    gotoxy(0, 0);
}

void draw_screen(int x, int y, int h_len, int v_len)
{
    clear_screen();

    draw_vertical_slide(2, y, v_len);
    draw_horizontal_slide(x, v_len + 2, h_len);

    fflush(stdout);
}

