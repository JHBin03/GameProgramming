# 1. C 언어 개발 환경

**VS Code에서 C 언어를 컴파일하는 방법**을 확인, 컴파일러 설치 방법 중 하나로 **MSYS2**를 사용

- **VS Code**: 코드를 작성하는 편집기
- **Compiler**: 작성한 C 코드를 실행 가능한 프로그램으로 변환
- **MSYS2**: Windows 환경에서 GCC 계열 컴파일러를 설치하고 사용할 수 있도록 도와주는 환경

---

# 2. 커서의 위치 제어

콘솔 프로그램에서는 기본적으로 출력이 현재 커서 위치에서부터 이어집니다.  
원하는 위치에 문자를 출력하려면 커서의 좌표를 이동시켜야 합니다.

강의 자료에서는 이를 위해 `gotoxy()` 함수를 만들어 사용합니다.

## 2.1 `gotoxy()` 함수

```c
#include <windows.h>

void gotoxy(int x, int y)
{
    COORD Pos = {x - 1, y - 1};
    SetConsoleCursorPosition(GetStdHandle(STD_OUTPUT_HANDLE), Pos);
}
```

`gotoxy(x, y)`를 호출하면 콘솔의 커서를 지정한 위치로 이동시킬 수 있습니다.

예를 들어 다음과 같이 사용합니다.

```c
gotoxy(2, 4);
printf("Hello");

gotoxy(40, 20);
printf("Hello");
```

첫 번째 `Hello`는 `(2, 4)` 위치에, 두 번째 `Hello`는 `(40, 20)` 위치에 출력됩니다.

---

## 2.2 `COORD`

```c
COORD Pos = {x - 1, y - 1};
```

`COORD`는 Windows 콘솔에서 **좌표를 저장하기 위한 구조체**입니다.

여기서는 `Pos`라는 변수를 만들고 다음 두 좌표를 저장합니다.

```text
Pos.X = x - 1
Pos.Y = y - 1
```

강의에서 사용하는 좌표는 `(1, 1)`부터 시작한다고 생각하지만, Windows 콘솔 내부 좌표는 `(0, 0)`부터 시작하기 때문에 `x - 1`, `y - 1`을 사용합니다.

예를 들어

```c
gotoxy(1, 1);
```

을 호출하면 내부적으로는

```c
COORD Pos = {0, 0};
```

이 됩니다.

---

## 2.3 `GetStdHandle(STD_OUTPUT_HANDLE)`

```c
GetStdHandle(STD_OUTPUT_HANDLE)
```

`STD_OUTPUT_HANDLE`은 **콘솔의 표준 출력 화면**을 의미합니다.

따라서 이 코드는 커서 위치를 변경할 대상인 **현재 콘솔 출력 화면의 Handle**을 가져오는 부분입니다.

---

## 2.4 `SetConsoleCursorPosition()`

```c
SetConsoleCursorPosition(
    GetStdHandle(STD_OUTPUT_HANDLE),
    Pos
);
```

`SetConsoleCursorPosition()`은 Windows 콘솔의 **커서 위치를 변경하는 함수**입니다.

두 개의 값이 전달됩니다.

```text
1. GetStdHandle(STD_OUTPUT_HANDLE)
   -> 어느 콘솔 화면의 커서를 움직일 것인지 지정

2. Pos
   -> 커서를 어디로 이동시킬 것인지 지정
```

즉 다음 코드를 하나의 문장처럼 이해하면 됩니다.

```c
SetConsoleCursorPosition(GetStdHandle(STD_OUTPUT_HANDLE), Pos);
```

> 현재 콘솔 출력 화면의 커서를 `Pos`에 저장된 좌표로 이동시킨다.

---

## 2.5 `gotoxy()` 전체 동작 과정

예를 들어 다음 코드를 실행한다고 가정합니다.

```c
gotoxy(10, 5);
```

### 1단계

함수에 다음 값이 전달됩니다.

```text
x = 10
y = 5
```

### 2단계

```c
COORD Pos = {x - 1, y - 1};
```

따라서 실제 Windows 콘솔 좌표는

```text
Pos = {9, 4}
```

가 됩니다.

### 3단계

```c
GetStdHandle(STD_OUTPUT_HANDLE)
```

을 통해 현재 콘솔 출력 화면을 가져옵니다.

### 4단계

```c
SetConsoleCursorPosition(..., Pos);
```

을 이용하여 커서를 `(9, 4)` 위치로 이동합니다.

### 5단계

그 다음 `printf()`를 실행하면 해당 위치부터 문자가 출력됩니다.

---

# 3. `gotoxy()` 활용 예제

## 3.1 서로 다른 위치에 문자열 출력

```c
#include <stdio.h>
#include <windows.h>

void gotoxy(int x, int y);

int main(void)
{
    gotoxy(2, 4);
    printf("Hello");

    gotoxy(40, 20);
    printf("Hello");

    return 0;
}

void gotoxy(int x, int y)
{
    COORD Pos = {x - 1, y - 1};
    SetConsoleCursorPosition(GetStdHandle(STD_OUTPUT_HANDLE), Pos);
}
```

이 예제는 같은 문자열을 서로 다른 위치에 출력합니다.

---

## 3.2 `gotoxy()`를 이용한 구구단 출력

강의 자료에서는 반복문과 `gotoxy()`를 같이 사용하여 **3단을 특정 위치에 출력**하는 예제를 사용합니다.

```c
#include <stdio.h>
#include <windows.h>

void gotoxy(int x, int y);

int main(void)
{
    for (int i = 1; i <= 9; i++)
    {
        gotoxy(35, 5 + i);
        printf("%d*%d=%2d", 3, i, 3 * i);
    }

    printf("\n");
    return 0;
}

void gotoxy(int x, int y)
{
    COORD Pos = {x - 1, y - 1};
    SetConsoleCursorPosition(GetStdHandle(STD_OUTPUT_HANDLE), Pos);
}
```

반복할 때마다 `y` 좌표가 증가합니다.

```text
i = 1 -> gotoxy(35, 6)
i = 2 -> gotoxy(35, 7)
i = 3 -> gotoxy(35, 8)
...
i = 9 -> gotoxy(35, 14)
```

따라서 3단이 콘솔의 세로 방향으로 출력됩니다.

---

# 4. 화면 지우기

콘솔에 출력된 내용을 모두 지우고 새로운 화면을 표시하고 싶을 때 다음 코드를 사용합니다.

```c
system("cls");
```

이를 사용하려면 다음 헤더를 포함합니다.

```c
#include <stdlib.h>
```

---

## 4.1 `system()` 함수

```c
system("cls");
```

`system()`은 **운영체제의 명령어를 실행하도록 요청하는 C 함수**입니다.

Windows에는 콘솔 화면을 지우는 다음 명령어가 있습니다.

```text
cls
```

따라서

```c
system("cls");
```

은 다음과 같은 의미입니다.

> Windows에게 `cls` 명령어를 실행해 달라고 요청한다.

결과적으로 현재 콘솔 화면의 내용이 지워집니다.

---

## 4.2 화면 지우기 예제

```c
#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    char ch;

    printf("문자를 입력하고 Enter>");
    scanf("%c", &ch);

    system("cls");

    printf("입력된 문자 %c\n", ch);

    return 0;
}
```

실행 흐름은 다음과 같습니다.

```text
1. 사용자에게 문자 입력 요청
2. scanf()로 문자 입력
3. system("cls") 실행
4. 기존 콘솔 화면 삭제
5. 입력된 문자 출력
```

---

# 5. 1주차 핵심 정리

| 내용 | 역할 |
|---|---|
| `gotoxy(x, y)` | 콘솔의 커서를 원하는 위치로 이동 |
| `COORD` | Windows 콘솔의 좌표를 저장하는 구조체 |
| `GetStdHandle(STD_OUTPUT_HANDLE)` | 현재 콘솔의 표준 출력 화면을 가져옴 |
| `SetConsoleCursorPosition()` | 실제 콘솔 커서 위치를 변경 |
| `system()` | 운영체제의 명령어를 실행하도록 요청 |
| `system("cls")` | Windows의 `cls` 명령어를 실행하여 콘솔 화면을 지움 |

1주차에서 가장 중요한 흐름

```text
[커서 위치 변경]
(x, y)
  ↓
COORD Pos
  ↓
SetConsoleCursorPosition()
  ↓
원하는 위치에서 printf()
```

```text
[화면 지우기]
system("cls")
  ↓
Windows의 cls 명령 실행
  ↓
콘솔 화면 삭제
```

---
