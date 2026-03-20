CREATE TABLE "cotacoes" (
	"ticker" varchar(12) NOT NULL,
	"datpre" date NOT NULL,
	"codbdi" varchar(2) NOT NULL,
	"tpmerc" varchar(3) NOT NULL,
	"nome" varchar(12) NOT NULL,
	"especi" varchar(10) NOT NULL,
	"preabe" numeric(13, 2) NOT NULL,
	"premax" numeric(13, 2) NOT NULL,
	"premin" numeric(13, 2) NOT NULL,
	"premed" numeric(13, 2) NOT NULL,
	"preult" numeric(13, 2) NOT NULL,
	"preofc" numeric(13, 2) NOT NULL,
	"preofv" numeric(13, 2) NOT NULL,
	"totneg" integer NOT NULL,
	"quatot" bigint NOT NULL,
	"voltot" numeric(18, 2) NOT NULL
);
