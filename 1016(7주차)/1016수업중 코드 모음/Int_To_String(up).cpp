#include <stdio.h>
#include <string.h>
int main(void)
{
	char number[20];
	int length, i;
	printf("금액을 입력하고 Enter>");
	scanf("%s", number);
	length=strlen(number);
	for(i=0;i<length;i++)
		printf("%c\n", number[i]);
	return 0;
}
