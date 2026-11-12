#include <windows.h>
#include <conio.h>
#include <stdio.h>
#include <math.h>
#include <wchar.h>
#include <stdlib.h>
#include <time.h>
#include <vector>

// 건반 배치
const int KEY_COUNT = 8;
const int KEY_WIDTH = 8;
const int PANEL_WIDTH = KEY_COUNT * KEY_WIDTH + 5;
const int PANEL_HEIGHT = 15;
const int PANEL_X = 1;
const int PANEL_Y = 10;
const int KEY_LEFT = 2;
const int STATUS_Y = PANEL_Y + PANEL_HEIGHT + 2;
const int GAME_STATUS_Y = STATUS_Y + 3;
const int GAME_MESSAGE_Y = STATUS_Y + 4;
const int EXIT_Y = STATUS_Y + 7;
const WORD TITLE_COLOR = FOREGROUND_GREEN | FOREGROUND_BLUE | FOREGROUND_INTENSITY;
const WORD SECTION_COLOR = FOREGROUND_RED | FOREGROUND_GREEN | FOREGROUND_INTENSITY;
const WORD INPUT_COLOR = BACKGROUND_GREEN | BACKGROUND_BLUE | BACKGROUND_INTENSITY;
const WORD PREVIEW_COLOR = BACKGROUND_RED | BACKGROUND_GREEN | BACKGROUND_INTENSITY;
const WORD ERROR_COLOR = BACKGROUND_RED | FOREGROUND_RED | FOREGROUND_GREEN |
                         FOREGROUND_BLUE | FOREGROUND_INTENSITY;
const WORD SUCCESS_COLOR = BACKGROUND_GREEN | BACKGROUND_INTENSITY;
const WORD WHITE_KEY = BACKGROUND_RED | BACKGROUND_GREEN | BACKGROUND_BLUE |
                       BACKGROUND_INTENSITY;
const WORD CYAN_KEY = BACKGROUND_GREEN | BACKGROUND_BLUE | BACKGROUND_INTENSITY;
const WORD CASE_COLOR = BACKGROUND_INTENSITY | FOREGROUND_RED |
                        FOREGROUND_GREEN | FOREGROUND_BLUE | FOREGROUND_INTENSITY;
const WORD EDGE_COLOR = FOREGROUND_INTENSITY;
const WORD NORMAL_COLOR = FOREGROUND_RED | FOREGROUND_GREEN | FOREGROUND_BLUE;
HANDLE console_output;

// 건반 안내 종류
const int GUIDE_MODE_COUNT = 4;
int key_guide_mode = 0;
int screen_mode = 0; // 0: 메인, 1: 기억력, 2: 청음
const wchar_t *GUIDE_MODE_NAMES[GUIDE_MODE_COUNT] = {
    L"\uB3C4\uB808\uBBF8", L"\uC601\uBB38 \uC74C\uC774\uB984", L"\uD55C\uAE00 \uC74C\uC774\uB984", L"\uC22B\uC790\uB9CC"
};

// 커서 위치 이동
void gotoxy(int x, int y)
{
    COORD pos = {static_cast<SHORT>(x), static_cast<SHORT>(y)};
    SetConsoleCursorPosition(console_output, pos);
}

// 한글 유니코드 출력
void print_text(const wchar_t *text)
{
    DWORD mode, written;
    if (GetConsoleMode(console_output, &mode))
        WriteConsoleW(console_output, text, static_cast<DWORD>(wcslen(text)), &written, NULL);
    else
    {
        char utf8[2048];
        int size = WideCharToMultiByte(CP_UTF8, 0, text, -1, utf8, sizeof(utf8), NULL, NULL);
        if (size > 1)
            WriteFile(console_output, utf8, size - 1, &written, NULL);
    }
}

// 건반 모양과 색상
void build_keyboard(CHAR_INFO *cells, int active_key)
{
    for (int y = 0; y < PANEL_HEIGHT; ++y)
    {
        for (int x = 0; x < PANEL_WIDTH; ++x)
        {
            CHAR_INFO &cell = cells[y * PANEL_WIDTH + x];
            cell.Char.UnicodeChar = L' ';
            cell.Attributes = CASE_COLOR;
            if (y == 0 || y == PANEL_HEIGHT - 1)
                cell.Char.UnicodeChar = (x == 0 || x == PANEL_WIDTH - 1) ? L'+' : L'-';
            else if (x == 0 || x == PANEL_WIDTH - 1)
                cell.Char.UnicodeChar = L'|';

            // 흰 건반과 청록색 강조
            if (y >= 2 && y <= 13 && x >= KEY_LEFT && x <= KEY_LEFT + KEY_COUNT * KEY_WIDTH)
            {
                int offset = x - KEY_LEFT;
                bool divider = offset % KEY_WIDTH == 0;
                int key = offset / KEY_WIDTH;
                cell.Attributes = (!divider && key == active_key) ? CYAN_KEY : WHITE_KEY;
                cell.Char.UnicodeChar = divider ? L'|' : L' ';
                if (y == 2 || y == 13)
                    cell.Char.UnicodeChar = divider ? L'+' : L'-';
            }
        }
    }

    // 검은 건반: 두 개와 세 개
    const int boundaries[] = {1, 2, 4, 5, 6};
    for (int i = 0; i < 5; ++i)
    {
        int center = KEY_LEFT + boundaries[i] * KEY_WIDTH;
        for (int y = 2; y <= 7; ++y)
        {
            for (int x = center - 1; x <= center + 1; ++x)
            {
                CHAR_INFO &cell = cells[y * PANEL_WIDTH + x];
                cell.Char.UnicodeChar = (y == 7) ? L'_' : L' ';
                cell.Attributes = (y == 7) ? FOREGROUND_INTENSITY : 0;
            }
        }
        // 검은 건반 아래 그림자
        for (int x = center - 1; x <= center + 1; ++x)
        {
            CHAR_INFO &cell = cells[8 * PANEL_WIDTH + x];
            cell.Char.UnicodeChar = L'-';
            cell.Attributes = BACKGROUND_INTENSITY;
        }
    }
}

// 피아노 화면 표시
void display_piano_keyboard(int active_key = -1)
{
    CHAR_INFO cells[PANEL_WIDTH * PANEL_HEIGHT];
    build_keyboard(cells, active_key);
    COORD size = {PANEL_WIDTH, PANEL_HEIGHT};
    COORD origin = {0, 0};
    SMALL_RECT area = {PANEL_X, PANEL_Y, PANEL_X + PANEL_WIDTH - 1,
                       PANEL_Y + PANEL_HEIGHT - 1};
    WriteConsoleOutputW(console_output, cells, size, origin, &area);

    // 숫자는 항상 표시하고 음이름만 변경
    const wchar_t *labels[3][KEY_COUNT] = {
        {L"\uB3C4", L"\uB808", L"\uBBF8", L"\uD30C", L"\uC194", L"\uB77C", L"\uC2DC", L"\uB3C4"},
        {L"C", L"D", L"E", L"F", L"G", L"A", L"B", L"C"},
        {L"\uB2E4", L"\uB77C", L"\uB9C8", L"\uBC14", L"\uC0AC", L"\uAC00", L"\uB098", L"\uB2E4"}
    };
    for (int key = 0; key < KEY_COUNT; ++key)
    {
        SetConsoleTextAttribute(console_output, key == active_key ? CYAN_KEY : WHITE_KEY);
        wchar_t number[] = {static_cast<wchar_t>(L'1' + key), L'\0'};
        gotoxy(PANEL_X + KEY_LEFT + key * KEY_WIDTH + 4, PANEL_Y + 10);
        print_text(number);
        if (key_guide_mode < 3)
        {
            int label_offset = key_guide_mode == 1 ? 4 : 3;
            gotoxy(PANEL_X + KEY_LEFT + key * KEY_WIDTH + label_offset, PANEL_Y + 11);
            print_text(labels[key_guide_mode][key]);
        }
    }
    SetConsoleTextAttribute(console_output, NORMAL_COLOR);
}

// 음표별 박자: 4분음표 한 박
const int TEMPO_BPM = 120;
const int NOTE_COUNT = 5;
const int HALF_BEATS[NOTE_COUNT] = {1, 2, 4, 6, 8};
const wchar_t *NOTE_NAMES[NOTE_COUNT] = {
    L"8\uBD84 \uC74C\uD45C(0.5\uBC15)", L"4\uBD84 \uC74C\uD45C(1\uBC15)", L"2\uBD84 \uC74C\uD45C(2\uBC15)",
    L"\uC8102\uBD84 \uC74C\uD45C(3\uBC15)", L"\uC628\uC74C\uD45C(4\uBC15)"
};

// 음표를 비프음 재생 시간으로 변환
int note_duration(int note_index)
{
    return 60000 * HALF_BEATS[note_index] / (TEMPO_BPM * 2);
}

// 안내 문구 갱신
void display_message(int row, const wchar_t *message)
{
    gotoxy(0, row);
    print_text(L"                                                                           ");
    gotoxy(0, row);
    print_text(message);
}

// 색상별 제목과 구분선
void display_colored_message(int row, const wchar_t *text, WORD color)
{
    SetConsoleTextAttribute(console_output, color);
    display_message(row, text);
    SetConsoleTextAttribute(console_output, NORMAL_COLOR);
}

void display_separator(int row)
{
    display_colored_message(row,
        L"  ---------------------------------------------------------------------", EDGE_COLOR);
}

// 핵심 수치를 네 개의 카드로 크게 구분
void display_metric_card(int index, const wchar_t *title, const wchar_t *value, WORD color)
{
    const int width = 17, height = 4;
    CHAR_INFO cells[width * height];
    WORD background = BACKGROUND_BLUE;
    for (int y = 0; y < height; ++y)
    {
        for (int x = 0; x < width; ++x)
        {
            CHAR_INFO &cell = cells[y * width + x];
            bool edge = y == 0 || y == height - 1 || x == 0 || x == width - 1;
            cell.Attributes = background | (edge ? FOREGROUND_INTENSITY : color);
            cell.Char.UnicodeChar = (y == 0 || y == height - 1) ?
                ((x == 0 || x == width - 1) ? L'+' : L'-') :
                ((x == 0 || x == width - 1) ? L'|' : L' ');
        }
    }
    COORD size = {width, height}, origin = {0, 0};
    SMALL_RECT area = {static_cast<SHORT>(2 + index * width), 2,
                       static_cast<SHORT>(2 + (index + 1) * width - 1), 5};
    WriteConsoleOutputW(console_output, cells, size, origin, &area);
    SetConsoleTextAttribute(console_output, background | color);
    gotoxy(4 + index * width, 3);
    print_text(title);
    gotoxy(4 + index * width, 4);
    print_text(value);
    SetConsoleTextAttribute(console_output, NORMAL_COLOR);
}

// 입력과 문제 진행률을 같은 위치에 표시
void display_game_progress(unsigned int completed, unsigned int total, const wchar_t *label)
{
    wchar_t bar[25], text[128];
    unsigned int filled = total == 0 ? 0 : static_cast<unsigned int>(24.0 * completed / total);
    if (filled > 24) filled = 24;
    for (unsigned int i = 0; i < 24; ++i) bar[i] = i < filled ? L'#' : L'-';
    bar[24] = L'\0';
    swprintf(text, 128, L"  %ls  [%ls]  %u / %u", label, bar, completed, total);
    display_colored_message(6, text, TITLE_COLOR);
}

// 지금 해야 할 행동은 건반 바로 위에 고정
void display_action(const wchar_t *text, WORD color)
{
    display_colored_message(9, text, color);
}

// 건반 표시 설정은 한곳에 모아서 안내
void display_key_guide_status(void)
{
    wchar_t text[128];
    swprintf(text, 128, L"  [T] \uC74C\uC774\uB984 \uC804\uD658  |  \uD604\uC7AC: %ls", GUIDE_MODE_NAMES[key_guide_mode]);
    display_message(screen_mode == 0 ? 7 : STATUS_Y + 1, text);
}

// 도레미, 영문, 한글, 숫자만 순서로 전환
void cycle_key_guide(void)
{
    key_guide_mode = (key_guide_mode + 1) % GUIDE_MODE_COUNT;
    display_piano_keyboard();
    display_key_guide_status();
}

// 메인은 메뉴, 게임 중에는 핵심 수치와 조작만 표시
void display_manual(void)
{
    for (int row = 2; row <= 7; ++row) display_message(row, L"");
    const wchar_t *title = screen_mode == 1 ? L"  MEMORY GAME  |  \uAE30\uC5B5\uB825 \uD14C\uC2A4\uD2B8" :
                           screen_mode == 2 ? L"  EAR TRAINING  |  \uCCAD\uC74C \uD14C\uC2A4\uD2B8" :
                           L"  P I A N O   |   \uAE30\uC5B5\uB825 & \uCCAD\uC74C \uD2B8\uB808\uC774\uB2DD";
    display_colored_message(0, title, TITLE_COLOR);
    display_separator(1);
    if (screen_mode == 1)
    {
        display_message(7, L"  [1~8] \uC21C\uC11C \uC785\uB825   [H] \uC804\uCCB4 \uB2E4\uC2DC \uBCF4\uAE30   [T] \uC74C\uC774\uB984   [Esc] \uB098\uAC00\uAE30");
        display_action(L"  [\uC900\uBE44] \uAC74\uBC18 \uC21C\uC11C\uB97C \uAE30\uC5B5\uD55C \uB4A4 \uB530\uB77C \uB204\uB974\uC138\uC694.", PREVIEW_COLOR);
    }
    else if (screen_mode == 2)
    {
        display_message(7, L"  [\uC704/\uC544\uB798] \uB2F5 \uC625\uD0C0\uBE0C   [R] \uB2E4\uC2DC \uB4E3\uAE30   [T] \uC74C\uC774\uB984   [Esc] \uB098\uAC00\uAE30");
        display_action(L"  [\uC900\uBE44] \uC18C\uB9AC\uB97C \uB4E3\uACE0 \uC22B\uC790 1~8\uB85C \uB2F5\uC744 \uC81C\uCD9C\uD558\uC138\uC694.", PREVIEW_COLOR);
    }
    else
    {
        display_colored_message(2, L"  [\uAC8C\uC784 \uC120\uD0DD]", SECTION_COLOR);
        display_message(3, L"  [M] \uAE30\uC5B5\uB825 \uD14C\uC2A4\uD2B8    [E] \uCCAD\uC74C \uD14C\uC2A4\uD2B8    [Esc] \uC885\uB8CC");
        display_colored_message(4, L"  [\uC5F0\uC8FC \uC870\uC791 \uBC0F \uC124\uC815]", SECTION_COLOR);
        display_message(5, L"  [1~8] \uC5F0\uC8FC  [\uC704/\uC544\uB798] \uC625\uD0C0\uBE0C  [\uC88C/\uC6B0] \uC74C \uAE38\uC774  [Z X C V B] \uBC14\uB85C \uC120\uD0DD");
        display_colored_message(6, L"  [\uAC74\uBC18 \uC774\uB984 \uD45C\uC2DC]", SECTION_COLOR);
        display_message(9, L"");
    }
    display_key_guide_status();
    display_separator(8);
    display_separator(STATUS_Y - 2);
    display_colored_message(STATUS_Y - 1,
        screen_mode == 2 ? L"  [\uB2F5\uC758 \uC625\uD0C0\uBE0C \uBC0F \uC74C \uAE38\uC774]" : L"  [\uD604\uC7AC \uC124\uC815]", EDGE_COLOR);
    if (screen_mode == 0) display_separator(STATUS_Y + 1);
    const wchar_t *progress_title = screen_mode == 0 ? L"  [\uC54C\uB9BC \uBC0F \uCD5C\uADFC \uACB0\uACFC]" : L"  [\uC0C1\uC138 \uC548\uB0B4 / \uACB0\uACFC]";
    display_colored_message(STATUS_Y + 2, progress_title, EDGE_COLOR);
    display_separator(GAME_MESSAGE_Y + 1);
}

// 모드 전환 시 해당 게임의 조작법으로 교체
void set_screen_mode(int mode)
{
    screen_mode = mode;
    display_manual();
}

// 음 높이 계산
int calc_frequency(int octave, int index)
{
    return static_cast<int>(32.7032 * pow(2.0, octave - 1 + index / 12.0) + 0.5);
}

// 소리가 나는 동안 건반 전체 강조
void play_key(int key, int octave, int note_index)
{
    const int indices[] = {0, 2, 4, 5, 7, 9, 11, 12};
    display_piano_keyboard(key);
    Beep(calc_frequency(octave, indices[key]), note_duration(note_index));
    display_piano_keyboard();
}

// 옥타브와 음표 선택
void arrow_key_control(int code, int *octave, int *selected)
{
    if (code == 72 && *octave < 6) ++*octave;
    if (code == 80 && *octave > 2) --*octave;
    if (code == 75 && *selected > 0) --*selected;
    if (code == 77 && *selected < NOTE_COUNT - 1) ++*selected;
}

// 현재 음표 이름과 박자 표시
void display_status(int octave, int selected)
{
    display_message(STATUS_Y, L"");
    wchar_t text[128];
    swprintf(text, 128, L"  \uC625\uD0C0\uBE0C: %d | \uC74C \uAE38\uC774: ", octave);
    print_text(text);
    SetConsoleTextAttribute(console_output,
        FOREGROUND_GREEN | FOREGROUND_BLUE | FOREGROUND_INTENSITY);
    print_text(NOTE_NAMES[selected]);
    SetConsoleTextAttribute(console_output, NORMAL_COLOR);
    swprintf(text, 128, L" | 1\uBC15 = %dms", 60000 / TEMPO_BPM);
    print_text(text);
}

// 문제 재생 중 입력은 정답으로 처리하지 않음
bool discard_preview_input(void)
{
    bool cancelled = false;
    while (_kbhit())
    {
        int code = _getch();
        if (code == 27) cancelled = true;
        if (code == 0 || code == 224) _getch();
    }
    return cancelled;
}

// 게임 입력: 숫자, H 힌트, T 안내 변경, Esc 취소
int read_answer(void)
{
    while (true)
    {
        int code = _getch();
        if (code == 27) return -1;
        if (code == 'h' || code == 'H') return -2;
        if (code == 't' || code == 'T') { cycle_key_guide(); continue; }
        if (code == 0 || code == 224) { _getch(); continue; }
        if (code >= '1' && code <= '8') return code - '1';
    }
}

// 단계, 목숨, 힌트, 점수를 상단에 고정
void display_game_status(unsigned int stage, int score, int lives, int hints)
{
    wchar_t value[32];
    swprintf(value, 32, L"%u \uB2E8\uACC4", stage);
    display_metric_card(0, L"\uD604\uC7AC \uB2E8\uACC4", value, TITLE_COLOR);
    swprintf(value, 32, L"%d / 3", lives);
    display_metric_card(1, L"\uB0A8\uC740 \uBAA9\uC228", value, lives <= 1 ?
        FOREGROUND_RED | FOREGROUND_INTENSITY : SECTION_COLOR);
    swprintf(value, 32, L"%d \uAC1C", hints);
    display_metric_card(2, L"\uD78C\uD2B8 [H]", value, hints == 0 ? FOREGROUND_INTENSITY : TITLE_COLOR);
    swprintf(value, 32, L"%d \uC810", score);
    display_metric_card(3, L"\uD68D\uB4DD \uC810\uC218", value, SECTION_COLOR);
    display_colored_message(GAME_STATUS_Y,
        L"  \uBAA9\uC228\uC740 \uD68C\uBCF5\uB418\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4. 3\uB2E8\uACC4 \uC131\uACF5\uB9C8\uB2E4 \uD78C\uD2B8 +1", EDGE_COLOR);
}

// 문제 순서를 다시 보여주기
bool replay_sequence(const std::vector<int> &sequence, int octave, int selected, bool hint = false)
{
    display_message(GAME_MESSAGE_Y, L"  \uAC74\uBC18 \uC21C\uC11C\uB97C \uAE30\uC5B5\uD558\uC138\uC694. Esc: \uCDE8\uC18C");
    display_action(hint ? L"  [\uD78C\uD2B8 \uC0AC\uC6A9] \uC804\uCCB4 \uC21C\uC11C\uB97C \uB2E4\uC2DC \uBCF4\uC5EC\uC90D\uB2C8\uB2E4." :
                   L"  [\uAE30\uC5B5\uD558\uC138\uC694] \uAC74\uBC18\uACFC \uC18C\uB9AC\uAC00 \uB098\uC624\uB294 \uC21C\uC11C\uB97C \uBCF4\uC138\uC694.", PREVIEW_COLOR);
    display_game_progress(0, static_cast<unsigned>(sequence.size()), L"\uBB38\uC81C \uC7AC\uC0DD");
    Sleep(600);
    for (size_t i = 0; i < sequence.size(); ++i)
    {
        if (discard_preview_input()) return false;
        play_key(sequence[i], octave, selected);
        display_game_progress(static_cast<unsigned>(i + 1), static_cast<unsigned>(sequence.size()), L"\uBB38\uC81C \uC7AC\uC0DD");
        Sleep(180);
    }
    return !discard_preview_input();
}

// 기억력 테스트
void memory_test(int octave, int selected)
{
    std::vector<int> sequence;
    unsigned int stage = 1;
    int score = 0;
    // 초기 힌트와 목숨
    int hints = 3;
    int lives = 3;
    wchar_t message[128];
    while (true)
    {
        // 단계가 오를 때만 무작위 건반 추가
        sequence.push_back(rand() % KEY_COUNT);
        display_game_status(stage, score, lives, hints);
        if (!replay_sequence(sequence, octave, selected))
        {
            display_message(GAME_MESSAGE_Y, L"  \uCDE8\uC18C. M: \uAE30\uC5B5\uB825 / E: \uCCAD\uC74C \uD14C\uC2A4\uD2B8 / 1~8: \uC790\uC720 \uC5F0\uC8FC");
            return;
        }

        size_t input_index = 0;
        while (input_index < sequence.size())
        {
            display_game_progress(static_cast<unsigned>(input_index), stage, L"\uC785\uB825 \uC644\uB8CC");
            display_action(L"  [\uC785\uB825 \uCC28\uB840] \uC22B\uC790 1~8\uB85C \uC21C\uC11C\uB300\uB85C \uB204\uB974\uC138\uC694.  [H] \uD78C\uD2B8", INPUT_COLOR);
            swprintf(message, 128, L"  \uC785\uB825 %u/%u\uAC1C | H: \uD78C\uD2B8(\uCC98\uC74C\uBD80\uD130 \uB2E4\uC2DC \uC785\uB825) / Esc: \uCDE8\uC18C",
                     static_cast<unsigned>(input_index + 1), stage);
            display_message(GAME_MESSAGE_Y, message);
            int answer = read_answer();
            if (answer == -1)
            {
                display_message(GAME_MESSAGE_Y, L"  \uCDE8\uC18C. M: \uAE30\uC5B5\uB825 / E: \uCCAD\uC74C \uD14C\uC2A4\uD2B8 / 1~8: \uC790\uC720 \uC5F0\uC8FC");
                return;
            }
            // 힌트 한 개로 전체 순서 재생
            if (answer == -2)
            {
                if (hints == 0)
                {
                    display_action(L"  [\uD78C\uD2B8 \uC5C6\uC74C] \uC9C0\uAE08\uAE4C\uC9C0 \uC785\uB825\uD55C \uC21C\uC11C\uC5D0 \uC774\uC5B4\uC11C \uB2F5\uD558\uC138\uC694.", PREVIEW_COLOR);
                    display_message(GAME_MESSAGE_Y, L"  \uB0A8\uC740 \uD78C\uD2B8\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4. \uC785\uB825\uC744 \uACC4\uC18D\uD558\uC138\uC694.");
                    Sleep(800);
                    continue;
                }
                --hints;
                display_game_status(stage, score, lives, hints);
                if (!replay_sequence(sequence, octave, selected, true))
                {
                    display_message(GAME_MESSAGE_Y, L"  \uCDE8\uC18C. M: \uAE30\uC5B5\uB825 / E: \uCCAD\uC74C \uD14C\uC2A4\uD2B8 / 1~8: \uC790\uC720 \uC5F0\uC8FC");
                    return;
                }
                input_index = 0;
                continue;
            }

            play_key(answer, octave, selected);
            // 오답이면 목숨 차감 후 같은 단계 재도전
            if (answer != sequence[input_index])
            {
                --lives;
                display_action(L"  [\uC624\uB2F5] \uBAA9\uC228 -1  |  \uAC19\uC740 \uC21C\uC11C\uB97C \uCC98\uC74C\uBD80\uD130 \uB2E4\uC2DC \uC785\uB825\uD558\uC138\uC694.", ERROR_COLOR);
                display_game_status(stage, score, lives, hints);
                if (lives == 0)
                {
                    display_action(L"  [\uAC8C\uC784 \uC885\uB8CC] \uBAA9\uC228\uC744 \uBAA8\uB450 \uC0AC\uC6A9\uD588\uC2B5\uB2C8\uB2E4.", ERROR_COLOR);
                    swprintf(message, 128, L"  \uAC8C\uC784 \uC885\uB8CC! %u\uB2E8\uACC4 | \uCD5C\uC885 \uC810\uC218 %d | M: \uB2E4\uC2DC \uC2DC\uC791", stage, score);
                    display_message(GAME_MESSAGE_Y, message);
                    return;
                }
                display_message(GAME_MESSAGE_Y, L"  \uC624\uB2F5! \uBAA9\uC228 -1. \uAC19\uC740 \uC21C\uC11C\uB97C \uCC98\uC74C\uBD80\uD130 \uC785\uB825\uD558\uC138\uC694. H: \uD78C\uD2B8");
                input_index = 0;
                Sleep(1000);
                continue;
            }
            ++input_index;
            display_game_progress(static_cast<unsigned>(input_index), stage, L"\uC785\uB825 \uC644\uB8CC");
        }

        // 세 단계 성공마다 힌트 한 개 지급
        ++score;
        bool bonus_hint = score % 3 == 0;
        if (bonus_hint) ++hints;
        display_action(bonus_hint ? L"  [\uB2E8\uACC4 \uC131\uACF5] +1\uC810!  \uD78C\uD2B8\uB3C4 1\uAC1C \uBC1B\uC558\uC2B5\uB2C8\uB2E4." :
                       L"  [\uB2E8\uACC4 \uC131\uACF5] +1\uC810!  \uB2E4\uC74C \uB2E8\uACC4\uB294 \uAC74\uBC18\uC774 \uD558\uB098 \uB298\uC5B4\uB0A9\uB2C8\uB2E4.", SUCCESS_COLOR);
        display_game_status(stage, score, lives, hints);
        swprintf(message, 128, L"  %u\uB2E8\uACC4 \uC131\uACF5! +1\uC810 | \uB2E4\uC74C: %u\uAC1C%ls", stage, stage + 1,
                 bonus_hint ? L" | \uD78C\uD2B8 +1!" : L"");
        display_message(GAME_MESSAGE_Y, message);
        Sleep(800);
        ++stage;
    }
}

// 청음 정답 판정: 계이름 1점, 실제 옥타브까지 맞으면 2점
int ear_answer_points(int target_key, int target_octave, int answer_key, int answer_octave)
{
    const int indices[] = {0, 2, 4, 5, 7, 9, 11, 12};
    if (indices[target_key] % 12 != indices[answer_key] % 12) return 0;
    int target_actual_octave = target_octave + indices[target_key] / 12;
    int answer_actual_octave = answer_octave + indices[answer_key] / 12;
    return target_actual_octave == answer_actual_octave ? 2 : 1;
}

// 청음 문제, 점수, 보너스, 답 옥타브를 상단에 고정
void display_ear_status(int question, int score, int bonus, int answer_octave)
{
    wchar_t value[32];
    swprintf(value, 32, L"%d / 10", question);
    display_metric_card(0, L"\uD604\uC7AC \uBB38\uC81C", value, TITLE_COLOR);
    swprintf(value, 32, L"%d \uC810", score);
    display_metric_card(1, L"\uCD1D\uC810 / 20", value, SECTION_COLOR);
    swprintf(value, 32, L"%d \uD68C", bonus);
    display_metric_card(2, L"\uC625\uD0C0\uBE0C \uBCF4\uB108\uC2A4", value, SECTION_COLOR);
    swprintf(value, 32, L"%d \uC625\uD0C0\uBE0C", answer_octave);
    display_metric_card(3, L"\uB2F5 \uC625\uD0C0\uBE0C", value, TITLE_COLOR);
}

// 청음 문제는 건반 강조 없이 소리만 출력
bool play_ear_question(int key, int octave, int selected)
{
    const int indices[] = {0, 2, 4, 5, 7, 9, 11, 12};
    display_piano_keyboard();
    display_action(L"  [\uB4E3\uB294 \uC911] \uAC74\uBC18 \uD45C\uC2DC \uC5C6\uC774 \uC18C\uB9AC\uB9CC \uB4E4\uB824\uC90D\uB2C8\uB2E4.", PREVIEW_COLOR);
    display_message(GAME_MESSAGE_Y, L"  \uC18C\uB9AC\uB9CC \uB4E3\uACE0 \uACC4\uC774\uB984\uACFC \uC625\uD0C0\uBE0C\uB97C \uB9DE\uCDB0 \uBCF4\uC138\uC694. Esc: \uCDE8\uC18C");
    Sleep(400);
    if (discard_preview_input()) return false;
    Beep(calc_frequency(octave, indices[key]), note_duration(selected));
    return !discard_preview_input();
}

// 청음 테스트: 열 문제, 최대 20점
void ear_test(int initial_octave, int selected)
{
    const int total_questions = 10;
    const wchar_t *names[] = {L"\uB3C4", L"\uB808", L"\uBBF8", L"\uD30C", L"\uC194", L"\uB77C", L"\uC2DC", L"\uB3C4"};
    int score = 0, answered = 0, correct = 0, octave_bonus = 0;
    int answer_octave = initial_octave;
    bool cancelled = false;
    wchar_t message[128];
    for (int question = 1; question <= total_questions; ++question)
    {
        // 문제의 계이름과 옥타브를 각각 무작위 선택
        int target_key = rand() % KEY_COUNT;
        int target_octave = 2 + rand() % 5;
        display_ear_status(question, score, octave_bonus, answer_octave);
        display_game_progress(static_cast<unsigned>(answered), total_questions, L"\uBB38\uC81C \uC644\uB8CC");
        swprintf(message, 128, L"  \uCCAD\uC74C %d/%d\uBB38\uC81C | \uC810\uC218 %d | \uACC4\uC774\uB984 +1\uC810 / \uC625\uD0C0\uBE0C +1\uC810",
                 question, total_questions, score);
        display_message(GAME_STATUS_Y, message);
        display_status(answer_octave, selected);
        if (!play_ear_question(target_key, target_octave, selected))
        {
            cancelled = true;
            break;
        }

        int answer_key = -1;
        while (answer_key < 0)
        {
            display_ear_status(question, score, octave_bonus, answer_octave);
            display_action(L"  [\uB2F5\uC744 \uACE0\uB974\uC138\uC694] \uC704/\uC544\uB798\uB85C \uC625\uD0C0\uBE0C \uC120\uD0DD \uD6C4 \uC22B\uC790 1~8 \uC81C\uCD9C", INPUT_COLOR);
            swprintf(message, 128, L"  \uB2F5 \uC625\uD0C0\uBE0C %d (\uC704/\uC544\uB798) | 1~8: \uC81C\uCD9C / R: \uB2E4\uC2DC \uB4E3\uAE30 / T: \uC548\uB0B4",
                     answer_octave);
            display_message(GAME_MESSAGE_Y, message);
            int code = _getch();
            if (code == 27) { cancelled = true; break; }
            if (code == 0 || code == 224)
            {
                code = _getch();
                if (code == 72 && answer_octave < 6) ++answer_octave;
                if (code == 80 && answer_octave > 2) --answer_octave;
                display_status(answer_octave, selected);
            }
            else if (code == 't' || code == 'T')
                cycle_key_guide();
            else if (code == 'r' || code == 'R')
            {
                if (!play_ear_question(target_key, target_octave, selected))
                {
                    cancelled = true;
                    break;
                }
            }
            else if (code >= '1' && code <= '8')
                answer_key = code - '1';
        }
        if (cancelled) break;

        // 사용자가 제출한 건반만 청록색으로 표시
        play_key(answer_key, answer_octave, selected);
        int points = ear_answer_points(target_key, target_octave, answer_key, answer_octave);
        score += points;
        ++answered;
        if (points > 0) ++correct;
        if (points == 2) ++octave_bonus;
        display_ear_status(question, score, octave_bonus, answer_octave);
        display_game_progress(static_cast<unsigned>(answered), total_questions, L"\uBB38\uC81C \uC644\uB8CC");
        display_action(points == 2 ? L"  [\uC644\uBCBD \uC815\uB2F5] \uACC4\uC774\uB984 +1\uC810 / \uC625\uD0C0\uBE0C \uBCF4\uB108\uC2A4 +1\uC810 = 2\uC810!" :
                       points == 1 ? L"  [\uACC4\uC774\uB984 \uC815\uB2F5] +1\uC810!  \uC625\uD0C0\uBE0C\uB294 \uC544\uB798 \uC815\uB2F5\uC744 \uD655\uC778\uD558\uC138\uC694." :
                       L"  [\uC624\uB2F5] \uC544\uB798 \uC815\uB2F5\uC744 \uD655\uC778\uD558\uACE0 \uB2E4\uC74C \uBB38\uC81C\uC5D0 \uB3C4\uC804\uD558\uC138\uC694.",
                       points > 0 ? SUCCESS_COLOR : ERROR_COLOR);
        int actual_octave = target_octave + (target_key == 7 ? 1 : 0);
        const wchar_t *result = points == 2 ? L"\uC644\uBCBD \uC815\uB2F5! +2\uC810" :
                                points == 1 ? L"\uACC4\uC774\uB984 \uC815\uB2F5! +1\uC810" : L"\uC624\uB2F5! +0\uC810";
        swprintf(message, 128, L"  %ls | \uC815\uB2F5: %ls, %d\uC625\uD0C0\uBE0C | \uCD1D\uC810 %d",
                 result, names[target_key], actual_octave, score);
        display_message(GAME_MESSAGE_Y, message);
        Sleep(1300);
    }
    // 테스트 결과와 자유 연주 설정 복원
    display_status(initial_octave, selected);
    swprintf(message, 128, L"  \uCCAD\uC74C %ls | %d\uBB38\uC81C \uC751\uB2F5 | \uC815\uB2F5 %d | \uC625\uD0C0\uBE0C \uBCF4\uB108\uC2A4 %d | \uC810\uC218 %d",
             cancelled ? L"\uC911\uB2E8" : L"\uC644\uB8CC", answered, correct, octave_bonus, score);
    display_message(GAME_STATUS_Y, message);
    display_message(GAME_MESSAGE_Y, L"  E: \uCCAD\uC74C \uB2E4\uC2DC \uC2DC\uC791 / M: \uAE30\uC5B5\uB825 \uD14C\uC2A4\uD2B8 / 1~8: \uC790\uC720 \uC5F0\uC8FC");
}

// 자유 연주와 테스트 시작
void practice_piano(void)
{
    int octave = 4, selected = 1;
    // 실행할 때 한 번만 난수 초기화
    srand(static_cast<unsigned int>(time(NULL)) ^
          static_cast<unsigned int>(GetTickCount()) ^
          static_cast<unsigned int>(GetCurrentProcessId()));
    display_piano_keyboard();
    display_status(octave, selected);
    // 시작 조작법은 상단, 진행 메시지는 하단
    display_message(GAME_STATUS_Y, L"  \uC790\uC720 \uC5F0\uC8FC\uB97C \uD558\uAC70\uB098 \uC0C1\uB2E8\uC5D0\uC11C \uAC8C\uC784\uC744 \uC120\uD0DD\uD558\uC138\uC694.");
    display_message(GAME_MESSAGE_Y, L"  \uC774\uACF3\uC5D0 \uAC8C\uC784 \uC9C4\uD589 \uC0C1\uD669\uACFC \uACB0\uACFC\uAC00 \uD45C\uC2DC\uB429\uB2C8\uB2E4.");
    while (true)
    {
        int code = _getch();
        if (code == 27) break;
        if (code == 0 || code == 224)
        {
            arrow_key_control(_getch(), &octave, &selected);
            display_status(octave, selected);
        }
        else if (code >= '1' && code <= '8')
            play_key(code - '1', octave, selected);
        else if (code == 'm' || code == 'M')
        {
            set_screen_mode(1);
            memory_test(octave, selected);
            set_screen_mode(0);
            display_status(octave, selected);
        }
        else if (code == 'e' || code == 'E')
        {
            set_screen_mode(2);
            ear_test(octave, selected);
            set_screen_mode(0);
        }
        else if (code == 't' || code == 'T')
            cycle_key_guide();
        else
        {
            // 음표 단축키: Z X C V B
            const char shortcuts[] = "zxcvb";
            if (code >= 'A' && code <= 'Z') code += 'a' - 'A';
            for (int i = 0; i < NOTE_COUNT; ++i)
                if (code == shortcuts[i]) selected = i;
            display_status(octave, selected);
        }
    }
    gotoxy(0, EXIT_Y);
}

// 화면 공간 확보
void prepare_console(void)
{
    CONSOLE_SCREEN_BUFFER_INFO info;
    if (!GetConsoleScreenBufferInfo(console_output, &info)) return;
    const SHORT required_height = EXIT_Y + 2;
    COORD buffer = info.dwSize;
    if (buffer.X < 80) buffer.X = 80;
    if (buffer.Y < required_height) buffer.Y = required_height;
    if (!SetConsoleScreenBufferSize(console_output, buffer)) return;
    COORD largest = GetLargestConsoleWindowSize(console_output);
    SHORT width = largest.X < 80 ? largest.X : 80;
    SHORT height = largest.Y < required_height ? largest.Y : required_height;
    if (width > 0 && height > 0)
    {
        SMALL_RECT window = {0, 0, static_cast<SHORT>(width - 1), static_cast<SHORT>(height - 1)};
        SetConsoleWindowInfo(console_output, TRUE, &window);
    }
}

// 콘솔 환경 설정과 복원
int main(void)
{
    console_output = GetStdHandle(STD_OUTPUT_HANDLE);
    CONSOLE_SCREEN_BUFFER_INFO info;
    bool have_info = GetConsoleScreenBufferInfo(console_output, &info) != 0;
    CONSOLE_CURSOR_INFO old_cursor;
    bool have_cursor = GetConsoleCursorInfo(console_output, &old_cursor) != 0;
    if (have_cursor)
    {
        CONSOLE_CURSOR_INFO hidden = old_cursor;
        hidden.bVisible = FALSE;
        SetConsoleCursorInfo(console_output, &hidden);
    }
    prepare_console();
    SetConsoleTextAttribute(console_output, NORMAL_COLOR);
    display_manual();
    practice_piano();
    if (have_info) SetConsoleTextAttribute(console_output, info.wAttributes);
    if (have_cursor) SetConsoleCursorInfo(console_output, &old_cursor);
    return 0;
}
