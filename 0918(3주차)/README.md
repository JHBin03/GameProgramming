# 게임 프로그래밍 - 카드 구현 정리

## MFC

- MFC(Microsoft Foundation Class) -> Windows 프로그램 제작에 사용하는 Microsoft의 C++ 라이브러리
- 버튼, 창, 메뉴 같은 GUI 구현에 사용한다.

## 모듈화

- 모듈화 -> 프로그램을 기능별로 나누는 것이다.
- 함수, 파일, 클래스 단위로 나눌 수 있다.
- 수정과 관리가 편해진다.
- 필요한 부분만 따로 고치기 쉽다.
- 예 -> 카드 생성, 출력, 섞기 기능을 각각 함수로 나눈다.

## random 관련

### seed 값

- seed -> 난수를 만들 때 기준이 되는 시작값
- 같은 seed면 같은 난수 순서가 나온다.
- `srand()`로 seed를 설정한다.
- 보통 `srand(time(NULL))`을 사용해 실행할 때마다 다른 값이 나오게 한다.

### `rand()` 함수의 프로토타입

```c
int rand(void);
```

- 반환값 -> `0 ~ RAND_MAX` 범위의 정수
- 헤더 파일 -> `<stdlib.h>`

### `srand()` 함수의 프로토타입

```c
void srand(unsigned int seed);
```

- 난수의 seed 값을 설정한다.
- 헤더 파일 -> `<stdlib.h>`

### 왜 나머지 연산자를 사용하는가?

```c
rand() % 52
```

- `rand()`는 큰 범위의 정수를 만든다.
- `% 52` -> 결과를 `0 ~ 51` 범위로 만든다.
- 카드 배열 위치를 정할 때 사용한다.

### VBA란?

- VBA(Visual Basic for Applications) -> Microsoft Office에서 사용하는 프로그래밍 언어
- Excel, Word, PowerPoint 작업 자동화에 사용한다.

## 카드 표시

- 트럼프 카드는 4개의 모양(♠, ◆, ♥, ♣)으로 구성한다.
- 각 모양마다 13장씩 존재한다.
- 전체 카드 수 -> 52장
- 카드 한 장 -> 숫자(또는 문자) + 모양
- 숫자와 모양을 같이 저장해야 하므로 구조체를 사용한다.

```c
struct trump
{
    int order;
    char shape[3];
    int number;
};
```

- `order` -> 카드 모양의 우선순위를 저장한다.
- `shape` -> 카드 모양을 저장한다.
- `number` -> 카드의 숫자 또는 문자를 저장한다.

## 카드 우선순위

- 스페이드(♠) -> `order = 0`
- 다이아몬드(◆) -> `order = 1`
- 하트(♥) -> `order = 2`
- 클로버(♣) -> `order = 3`

## 카드 생성

- 카드 모양은 2차원 배열에 저장한다.
- 반복문을 사용하여 총 52장의 카드를 생성한다.
- 바깥 반복문 -> 카드 모양을 결정한다.
- 안쪽 반복문 -> 1부터 13까지 카드 번호를 생성한다.
- `order` 값에 따라 카드 모양을 `shape`에 저장한다.
- 카드 번호는 `number`에 저장한다.

```c
char shape[4][3] = {"♠", "◆", "♥", "♣"};
```

- 숫자 1 -> `A`
- 숫자 11 -> `J`
- 숫자 12 -> `Q`
- 숫자 13 -> `K`
- 나머지 -> 숫자 그대로 사용한다.

```c
switch(m_card[j].number)
{
    case 1:
        m_card[j].number = 'A';
        break;

    case 11:
        m_card[j].number = 'J';
        break;

    case 12:
        m_card[j].number = 'Q';
        break;

    case 13:
        m_card[j].number = 'K';
        break;
}
```

## 카드 출력

- 생성된 카드 52장을 순서대로 출력한다.
- `number`가 10보다 큰 경우 -> 문자형으로 출력한다.
- 문자 출력 -> `%-2c`
- 숫자 출력 -> `%-2d`
- 13장 출력 후 줄을 바꾼다.

```c
void display_card(trump m_card[])
{
    int i, count = 0;

    for(i = 0; i < 52; i++)
    {
        printf("%s ", m_card[i].shape);

        if(10 < m_card[i].number)
            printf("%-2c ", m_card[i].number);
        else
            printf("%-2d ", m_card[i].number);

        count++;

        if(i % 13 + 1 == 13)
        {
            printf("\n");
            count = 0;
        }
    }
}
```

## main 함수

```c
int main(void)
{
    trump card[52];

    make_card(card);
    display_card(card);

    return 0;
}
```

- `make_card()` -> 카드 52장 생성
- `display_card()` -> 카드 출력

## 카드 섞기

- 카드 섞기 -> 서로 다른 위치의 카드를 교환한다.
- `rand()`를 사용하여 임의의 위치를 선택한다.
- 현재 위치와 난수로 선택된 위치의 카드를 교환한다.

### 방법 1

- 난수 `rnd`를 생성한다.
- 현재 카드와 `rnd` 위치의 카드를 교환한다.
- 문제 -> `rnd == i`이면 같은 위치를 선택하므로 실제 교환이 발생하지 않는다.

### 방법 2

- `rnd == i`이면 난수를 다시 생성한다.
- 현재 위치와 다른 위치가 선택될 때까지 반복한다.
- 같은 위치끼리 교환되는 경우를 방지한다.

```c
do
{
    rnd = rand() % 10;
}
while(rnd == i);
```

## 카드 섞는 함수

- `srand(time(NULL))` -> 난수의 초기값을 설정한다.
- `rand() % 52` -> 0~51 범위의 카드 위치를 선택한다.
- 임시 구조체 변수 `temp`를 사용하여 두 카드를 교환한다.

```c
void shuffle_card(trump m_card[])
{
    int i, rnd;
    trump temp;

    srand(time(NULL));

    for(i = 0; i < 52; i++)
    {
        rnd = rand() % 52;

        temp = m_card[rnd];
        m_card[rnd] = m_card[i];
        m_card[i] = temp;
    }
}
```

## 카드 섞은 후 출력

```c
int main(void)
{
    trump card[52];

    make_card(card);
    shuffle_card(card);
    display_card(card);

    return 0;
}
```

- `make_card()` -> 카드 생성
- `shuffle_card()` -> 카드 섞기
- `display_card()` -> 카드 출력
