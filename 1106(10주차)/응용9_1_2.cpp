#include <stdio.h>
#include <conio.h>
#include <stdlib.h>
#include <time.h>
#include <math.h>
#include <windows.h>

void draw_check02(int c, int r);
void gotoxy(int x, int y);
void display_piano_keyboard(void);
void touch_keyboard(int code);
void display_manual(void);
void practice_piano(void);
int calc_frequency(int octave, int inx);
void arrow_key_control(int code,int *base_octave,int *time_delay);

int main(void)
{
	display_manual();
	practice_piano();
	return 0;
}
void display_manual(void)
{
              //[함수 9.1.7]의 정의 부분 참고
	printf("키보드의 숫자를 누르면 \n");
	printf("해당 건반에 음이 표시되고,\n");
	printf("키↑: 한 옥타브 위로, 키↓:한 옥타브 아래로 \n");
	printf("키 ←:음의 지연시간 짧게, 키→:음의 지연시간 길게\n");

}
void practice_piano(void)
{
	int index[]={0, 2, 4, 5, 7, 9, 11, 12};
	int freq[8], code, i;
	int base_octave=4, time_delay=500;
	draw_check02(8, 2);
	display_piano_keyboard();
	do
	{
		for(i=0;i<8;i++)
		    freq[i]=calc_frequency(base_octave, index[i]);
		code=getch();
		if ('1'<=code && code<='8')
		{
 		    code-=49;
		    touch_keyboard(code);
		    Beep(freq[code],time_delay);
		    display_piano_keyboard();
		}
		else
		    arrow_key_control(code,&base_octave,&time_delay);
	gotoxy(1, 10);
	printf("현재 옥타브:%d, ", base_octave);
	printf("현재 지연시간:%4.2f초", time_delay/1000.);
	}while(code!=27);

}
int calc_frequency(int octave, int inx)
{
	double do_scale=32.7032;
	double ratio=pow(2., 1/12.), temp;
	int i;
	temp=do_scale*pow(2, octave-1);
	for(i=0;i<inx;i++)
	{
		temp=(int)(temp+0.5);
		temp*=ratio;
	}
	return (int) temp;
}
void display_piano_keyboard(void)
{
   	//[함수 9.1.3]의 정의 부분 참고
	int i;
	char code[8][4]={"도","레","미","파","솔","라","시","도"};
	for(i=0;i<8;i++)
	{
		gotoxy(3+i*4,6);
		printf("%2d", i+1); 
	}
	for(i=0;i<8;i++)
	{
		gotoxy(3+i*4,8);
		printf("%s", code[i]);
	}
}
void touch_keyboard(int code)
{
   	//[함수 9.1.4]의 정의 부분 참고
	gotoxy(3+code*4,8);
	printf("%c%c", 0xa1, 0xe3);
}
void draw_check02(int c, int r)
{
    int i, j;
    unsigned char a=0xa6;
    unsigned char b[12]; 
    for(i=1;i<12;i++)
	b[i]=0xa0+i;
    printf("%c%c",a, b[3]);
    for(i=0;i<c-1;i++)
    {
	printf("%c%c", a, b[1]);
	printf("%c%c", a, b[8]);
    }
    printf("%c%c", a, b[1]);
    printf("%c%c", a, b[4]);
    printf("\n");
    for(i=0;i<r-1;i++)
    {
	printf("%c%c", a, b[2]);
	for(j=0;j<c;j++)
	{
		printf("  ");
		printf("%c%c",a, b[2]);
	}
	printf("\n");
	printf("%c%c", a, b[7]);
	for(j=0;j<c-1;j++)
	{
		printf("%c%c", a, b[1]);
		printf("%c%c", a, b[11]);
	}
	printf("%c%c",a, b[1]);
	printf("%c%c",a, b[9]);
	printf("\n");
    }
    printf("%c%c", a, b[2]);
    for(j=0;j<c;j++)
    {
	printf("  ");
	printf("%c%c",a, b[2]);
    }
    printf("\n");
    printf("%c%c", a, b[6]);
    for(i=0;i<c-1;i++)
    {
	printf("%c%c", a, b[1]);
	printf("%c%c", a, b[10]);
    }
    printf("%c%c", a, b[1]);
    printf("%c%c", a, b[5]);
    printf("\n");
}
void gotoxy(int x, int y)
{
   COORD Pos = {x - 1, y - 1};
   SetConsoleCursorPosition(GetStdHandle(STD_OUTPUT_HANDLE), Pos);
}
void arrow_key_control(int code, int *base_octave, int *time_delay)
{
	switch(code)
	{
		case 72:
			*base_octave+=1;
			if(6<*base_octave)
				*base_octave=6;
			break;
		case 75:
			*time_delay-=250;
			if(*time_delay<250)
				*time_delay=250;
			break;
		case 77:
			*time_delay+=250;
			if (1000<*time_delay)
				*time_delay=1000;
			break;
		case 80:
			*base_octave-=1;
			if(*base_octave<=2)
				*base_octave=2;
			break;
		default:
			break;
	}

}
